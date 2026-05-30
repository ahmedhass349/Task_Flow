/*
  FILE: BackgroundServices/OfflineSyncService.cs
  PHASE: 1 & 3
  DEFECT: 2-Connection, 1-Injection
  CHANGES:
    - PingIntervalSeconds: 10 → 30. A 10-second ping cycle is too aggressive for Machine B's
      slower connection and amplifies the flip-flop caused by transient failures.
    - MirrorUpsert dispatch case: added stale-entry injection guard. For entries older than
      30 minutes that carry a SyncId, DocumentExistsBySyncIdAsync is called before pushing.
      If the document is absent from MongoDB (externally deleted), we return without throwing
      so ReplayEntryAsync marks the entry Synced and prunes it — injection prevented.
    - BackupUserAccount dispatch case: same stale-entry guard using AccountExistsInMongoAsync.
      Prevents resurrecting credential records for accounts deleted from MongoDB.
*/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using taskflow.Data;
using taskflow.Data.Entities;
using taskflow.DTOs.Mongo;
using taskflow.Hubs;
using taskflow.Services;
using taskflow.Services.Interfaces;

namespace taskflow.BackgroundServices
{
    /// <summary>
    /// Hosted service that:
    /// 1. Periodically pings MongoDB and updates <see cref="IConnectivityService"/>.
    /// 2. When connectivity is restored, replays all pending outbox entries.
    /// 3. Pushes real-time SignalR events for connectivity/sync status changes.
    /// </summary>
    public class OfflineSyncService : BackgroundService
    {
        private readonly IConnectivityService _connectivity;
        private readonly MongoService _mongoService;
        private readonly IHubContext<NotificationHub> _hub;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<OfflineSyncService> _logger;

        private const int PingIntervalSeconds = 30;

        // B-05: prevents concurrent replay when both the timer loop and the connectivity-changed
        // event handler call ReplayOutboxAsync at the same time.
        private int _replayRunning = 0;

        private static readonly JsonSerializerOptions _json =
            new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        public OfflineSyncService(
            IConnectivityService connectivity,
            MongoService mongoService,
            IHubContext<NotificationHub> hub,
            IServiceScopeFactory scopeFactory,
            ILogger<OfflineSyncService> logger)
        {
            _connectivity = connectivity;
            _mongoService = mongoService;
            _hub = hub;
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Subscribe to connectivity changes
            _connectivity.ConnectivityChanged += OnConnectivityChanged;

            // Initialise pending count from the DB
            await InitialisePendingCountAsync(stoppingToken);

            // Run the ping loop
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await _connectivity.CheckConnectivityAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "OfflineSyncService: ping loop error");
                }

                await Task.Delay(TimeSpan.FromSeconds(PingIntervalSeconds), stoppingToken)
                    .ContinueWith(_ => { }, TaskContinuationOptions.None); // swallow cancellation
            }

            _connectivity.ConnectivityChanged -= OnConnectivityChanged;
        }

        // ── Connectivity change handler ────────────────────────────────────────

        private void OnConnectivityChanged(bool isOnline)
        {
            // Use fire-and-forget so the event handler returns quickly
            _ = Task.Run(async () =>
            {
                try
                {
                    // Push connectivity status to all SignalR clients
                    await _hub.Clients.All.SendAsync(
                        "ConnectivityChanged", isOnline);

                    _logger.LogInformation("Pushed ConnectivityChanged({IsOnline}) via SignalR", isOnline);

                    if (isOnline)
                    {
                        // Give MongoDB a moment to stabilise, then replay outbox
                        await Task.Delay(1500);
                        await ReplayOutboxAsync(CancellationToken.None);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "OnConnectivityChanged handler error");
                }
            });
        }

        // ── Outbox replay ─────────────────────────────────────────────────────

        private async Task ReplayOutboxAsync(CancellationToken cancellationToken)
        {
            if (Interlocked.CompareExchange(ref _replayRunning, 1, 0) != 0)
            {
                _logger.LogDebug("OfflineSyncService: replay already in progress — skipping concurrent call.");
                return;
            }

            try
            {
                List<SyncOutboxEntry> pending;

                using (var scope = _scopeFactory.CreateScope())
                {
                    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    pending = await db.SyncOutboxEntries
                        .Where(e => e.Status == "Pending")
                        .OrderBy(e => e.CreatedAt)
                        .ToListAsync(cancellationToken);
                }

                if (pending.Count == 0) return;

                _logger.LogInformation("OfflineSyncService: replaying {Count} outbox entries", pending.Count);
                await _hub.Clients.All.SendAsync("SyncStarted", pending.Count, cancellationToken);

                int synced = 0, failed = 0;

                foreach (var entry in pending)
                {
                    if (cancellationToken.IsCancellationRequested) break;
                    if (!_connectivity.IsEffectivelyOnline) break;

                    bool ok = await ReplayEntryAsync(entry, cancellationToken);

                    if (ok) synced++;
                    else failed++;

                    _connectivity.AdjustPending(-1);

                    await _hub.Clients.All.SendAsync("SyncProgress",
                        synced + failed, pending.Count, cancellationToken);
                }

                _logger.LogInformation(
                    "OfflineSyncService: sync complete — synced={Synced}, failed={Failed}",
                    synced, failed);

                await _hub.Clients.All.SendAsync("SyncCompleted", synced, failed, cancellationToken);
            }
            finally
            {
                Interlocked.Exchange(ref _replayRunning, 0);
            }
        }

        private async Task<bool> ReplayEntryAsync(
            SyncOutboxEntry entry, CancellationToken cancellationToken)
        {
            // Mark as processing
            await SetEntryStatusAsync(entry.Id, "Processing", null);

            try
            {
                await DispatchAsync(entry, cancellationToken);
                await SetEntryStatusAsync(entry.Id, "Synced", null);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to replay outbox entry {Id} ({Op})",
                    entry.Id, entry.OperationName);

                int attempts = entry.Attempts + 1;
                string status = attempts >= 3 ? "Failed" : "Pending";

                await SetEntryStatusAsync(entry.Id, status, ex.Message, attempts);
                return false;
            }
        }

        private async Task DispatchAsync(SyncOutboxEntry entry, CancellationToken _ct)
        {
            var p = entry.PayloadJson;

            switch (entry.OperationName)
            {
                case "UpsertPresence":
                {
                    var x = Deserialize<UpsertPresencePayload>(p);
                    await _mongoService.UpsertPresenceAsync(x.Email, x.FullName, x.AvatarUrl);
                    break;
                }
                case "SendInvitation":
                {
                    var x = Deserialize<SendInvitationPayload>(p);
                    var req = new DTOs.Mongo.SendInvitationRequestDto
                    {
                        RecipientEmail = x.RecipientEmail,
                        TeamId = x.TeamId ?? string.Empty,
                        TeamName = x.TeamName ?? string.Empty,
                        Message = x.Message ?? string.Empty,
                        Role = x.Role ?? "Member",
                    };
                    await _mongoService.SendInvitationAsync(
                        x.SenderUserId, x.SenderEmail, x.SenderFullName,
                        x.SenderAvatarUrl, req);
                    break;
                }
                case "AcceptInvitation":
                {
                    var x = Deserialize<InvRespondPayload>(p);
                    await _mongoService.AcceptInvitationAsync(x.InvitationId, x.UserEmail);
                    break;
                }
                case "DeclineInvitation":
                {
                    var x = Deserialize<DeclinePayload>(p);
                    await _mongoService.DeclineInvitationAsync(x.InvitationId, x.UserEmail, x.Reason);
                    break;
                }
                case "CancelInvitation":
                {
                    var x = Deserialize<InvRespondPayload>(p);
                    await _mongoService.CancelInvitationAsync(x.InvitationId, x.UserEmail);
                    break;
                }
                case "DeleteInvitation":
                {
                    var x = Deserialize<DeleteInvPayload>(p);
                    await _mongoService.DeleteInvitationAsync(x.InvitationId, x.OwnerEmail);
                    break;
                }
                case "LeaveTeam":
                {
                    var x = Deserialize<LeaveTeamPayload>(p);
                    await _mongoService.LeaveTeamAsync(x.TeamId, x.UserEmail);
                    break;
                }
                case "RemoveTeamMember":
                {
                    var x = Deserialize<MemberPayload>(p);
                    await _mongoService.RemoveTeamMemberAsync(x.TeamId, x.MemberEmail, x.OwnerEmail);
                    break;
                }
                case "RemoveAllMemberRecords":
                {
                    var x = Deserialize<AllMembersPayload>(p);
                    await _mongoService.RemoveAllMemberRecordsAsync(x.MemberEmail, x.OwnerEmail);
                    break;
                }
                case "AddMemberToTeam":
                {
                    var x = Deserialize<AddMemberPayload>(p);
                    await _mongoService.AddMemberToTeamAsync(
                        x.OwnerEmail, x.MemberEmail, x.MemberFullName,
                        x.TargetTeamId, x.TargetTeamName, x.Role ?? "Member");
                    break;
                }
                case "MirrorUpsert":
                {
                    var x = Deserialize<MirrorUpsertPayload>(p);

                    // DEFECT 1 INJECTION GUARD: for outbox entries older than 30 minutes that
                    // carry a SyncId, verify the document still exists in MongoDB before pushing.
                    // If the document was externally deleted (e.g. via Atlas UI or admin tool)
                    // after the entry was queued, pushing it now would resurrect deleted data.
                    // We return without throwing so ReplayEntryAsync marks the entry as Synced
                    // and prunes it from the queue — it is treated as successfully handled.
                    if (!string.IsNullOrEmpty(x.SyncId) && entry.CreatedAt < DateTime.UtcNow.AddMinutes(-30))
                    {
                        bool docExists = await _mongoService.DocumentExistsBySyncIdAsync(
                            x.Collection, x.SyncId, CancellationToken.None);
                        if (!docExists)
                        {
                            _logger.LogWarning(
                                "INJECTION PREVENTION: skipping stale MirrorUpsert for {Col}/{SyncId} " +
                                "(queued {Age:F0}m ago — document absent from MongoDB, likely externally deleted).",
                                x.Collection, x.SyncId,
                                (DateTime.UtcNow - entry.CreatedAt).TotalMinutes);
                            return;
                        }
                    }

                    var doc = MongoDB.Bson.BsonDocument.Parse(x.ExtJson);
                    if (!string.IsNullOrEmpty(x.SyncId))
                    {
                        doc["_id"] = x.SyncId;
                        doc["intId"] = x.Id;
                        await _mongoService.UpsertDocumentBySyncIdAsync(x.Collection, x.SyncId, x.Id, doc);
                    }
                    else
                    {
                        doc["_id"] = x.Id;
                        await _mongoService.UpsertDocumentAsync(x.Collection, x.Id, doc);
                    }
                    break;
                }
                case "MirrorDelete":
                {
                    var x = Deserialize<MirrorDeletePayload>(p);
                    if (!string.IsNullOrEmpty(x.SyncId))
                        await _mongoService.DeleteDocumentBySyncIdAsync(x.Collection, x.SyncId);
                    else
                        await _mongoService.DeleteDocumentAsync(x.Collection, x.Id);
                    break;
                }
                case "DeleteUserData":
                {
                    var x = Deserialize<UserDataPayload>(p);
                    await _mongoService.DeleteUserDataAsync(x.UserEmail);
                    break;
                }
                case "BackupUserAccount":
                {
                    // Replays a credential backup that was queued while offline.
                    // DEFECT 1 INJECTION GUARD: for stale entries (>30 min old), verify the
                    // account still exists in MongoDB before pushing.  If it was externally
                    // deleted after the entry was queued, pushing it would resurrect the account.
                    // Return without throwing → marked Synced and pruned from the queue.
                    var x = Deserialize<BackupAccountPayload>(p);

                    if (entry.CreatedAt < DateTime.UtcNow.AddMinutes(-30))
                    {
                        bool accountExists = await _mongoService.AccountExistsInMongoAsync(x.Email);
                        if (!accountExists)
                        {
                            _logger.LogWarning(
                                "INJECTION PREVENTION: skipping stale BackupUserAccount for {Email} " +
                                "(queued {Age:F0}m ago — account absent from MongoDB, likely externally deleted).",
                                x.Email, (DateTime.UtcNow - entry.CreatedAt).TotalMinutes);
                            return;
                        }
                    }

                    await _mongoService.BackupUserAccountAsync(x.Email, x.PasswordHash, x.SqliteId);

                    using (var scope = _scopeFactory.CreateScope())
                    {
                        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                        var user = await db.AppUsers.FindAsync(x.SqliteId);
                        if (user != null && !user.IsBackedUpToMongo)
                        {
                            user.IsBackedUpToMongo = true;
                            await db.SaveChangesAsync();
                        }
                    }
                    break;
                }
                // Dispatch cases for cross-notifications and announcements queued while offline.
                case "WriteCrossNotification":
                {
                    var x = Deserialize<CrossNotificationPayload>(p);
                    await _mongoService.WriteCrossNotificationAsync(new taskflow.Models.Mongo.CrossNotification
                    {
                        RecipientEmail = x.RecipientEmail,
                        SenderEmail    = x.SenderEmail,
                        Title          = x.Title,
                        Message        = x.Message,
                        Type           = x.Type,
                        Priority       = x.Priority,
                        ActionUrl      = x.ActionUrl ?? string.Empty,
                    });
                    break;
                }
                case "WriteAnnouncement":
                {
                    var x = Deserialize<WriteAnnouncementPayload>(p);
                    await _mongoService.WriteAnnouncementAsync(new taskflow.Models.Mongo.TeamAnnouncement
                    {
                        Id          = x.Id,
                        TeamId      = x.TeamId,
                        TeamName    = x.TeamName,
                        SenderEmail = x.SenderEmail,
                        SenderName  = x.SenderName,
                        Title       = x.Title,
                        Message     = x.Message,
                        CreatedAt   = x.CreatedAt,
                    });
                    break;
                }
                default:
                    _logger.LogWarning("Unknown outbox operation: {Op}", entry.OperationName);
                    throw new InvalidOperationException($"Unknown operation: {entry.OperationName}");
            }
        }

        // ── DB helpers ────────────────────────────────────────────────────────

        private async Task SetEntryStatusAsync(
            int id, string status, string? error, int? attempts = null)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var entry = await db.SyncOutboxEntries.FindAsync(id);
                if (entry is null) return;

                entry.Status = status;
                entry.LastAttemptAt = DateTime.UtcNow;
                entry.ErrorMessage = error;
                if (attempts.HasValue) entry.Attempts = attempts.Value;

                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "SetEntryStatusAsync failed for entry {Id}", id);
            }
        }

        private async Task InitialisePendingCountAsync(CancellationToken cancellationToken)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                int count = await db.SyncOutboxEntries
                    .CountAsync(e => e.Status == "Pending", cancellationToken);
                _connectivity.AdjustPending(count);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "InitialisePendingCountAsync failed");
            }
        }

        // ── Payload record types ──────────────────────────────────────────────

        private static T Deserialize<T>(string json) =>
            JsonSerializer.Deserialize<T>(json, _json)
            ?? throw new InvalidOperationException("Null deserialization result");

        private record UpsertPresencePayload(string Email, string FullName, string AvatarUrl);

        private record SendInvitationPayload(
            string SenderUserId, string SenderEmail, string SenderFullName, string SenderAvatarUrl,
            string RecipientEmail, string? TeamId, string? TeamName, string? Message, string? Role);

        private record InvRespondPayload(string InvitationId, string UserEmail);

        private record DeclinePayload(string InvitationId, string UserEmail, string? Reason);

        private record DeleteInvPayload(string InvitationId, string OwnerEmail);

        private record LeaveTeamPayload(string TeamId, string UserEmail);

        private record MemberPayload(string TeamId, string MemberEmail, string OwnerEmail);

        private record AllMembersPayload(string MemberEmail, string OwnerEmail);

        private record AddMemberPayload(
            string OwnerEmail, string MemberEmail, string MemberFullName,
            string TargetTeamId, string TargetTeamName, string? Role);

        private record MirrorUpsertPayload(string Collection, int Id, string ExtJson, string? SyncId = null);

        private record MirrorDeletePayload(string Collection, int Id, string? SyncId = null);

        private record UserDataPayload(string UserEmail);

        private record BackupAccountPayload(string Email, string PasswordHash, int SqliteId);

        // P6-O1: payload for cross-notification queued while offline.
        private record CrossNotificationPayload(
            string RecipientEmail, string SenderEmail, string Title,
            string Message, string Type, string Priority, string? ActionUrl);

        // P6-O2: payload for announcement queued while offline.
        private record WriteAnnouncementPayload(
            string? Id, string TeamId, string TeamName,
            string SenderEmail, string SenderName, string Title, string Message, DateTime CreatedAt);
    }
}
