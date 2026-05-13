/*
  FILE: BackgroundServices/DatabaseCleanupService.cs
  PHASE: 3
  CHANGES: DB-01 SyncOutboxEntries pruning, DB-02 Notifications retention,
           DB-03 fired Reminders, DB-04 stale ChatbotConversations+Messages,
           DB-05 tombstoned Messages, DB-06 resolved LocalInvitations.
  NOTE:   DB-07 (MongoDB invitations TTL index) is handled in MongoService.EnsureIndexesAsync
          which already runs fire-and-forget during startup.
*/

using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using taskflow.Data;

namespace taskflow.BackgroundServices
{
    /// <summary>
    /// Daily background job that prunes stale rows from every unbounded SQLite table,
    /// preventing the database from growing without limit over the application's lifetime.
    /// </summary>
    public class DatabaseCleanupService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<DatabaseCleanupService> _logger;

        // ── Retention windows ─────────────────────────────────────────────────
        // DB-01: SyncOutboxEntry rows that are Synced or Failed
        private static readonly TimeSpan OutboxRetention = TimeSpan.FromDays(7);

        // DB-02: Notifications — read entries expire sooner than unread ones
        private static readonly TimeSpan NotificationReadRetention = TimeSpan.FromDays(90);
        private static readonly TimeSpan NotificationAllRetention  = TimeSpan.FromDays(180);

        // DB-03: Reminders that have already fired
        private static readonly TimeSpan ReminderRetention = TimeSpan.FromDays(30);

        // DB-04: Chatbot conversations with no activity
        private static readonly TimeSpan ChatRetention = TimeSpan.FromDays(90);

        // DB-05: Messages soft-deleted by both sender and receiver
        private static readonly TimeSpan MessageTombstoneRetention = TimeSpan.FromDays(30);

        // DB-06: Local invitation cache entries that are no longer Pending
        private static readonly TimeSpan InvitationCacheRetention = TimeSpan.FromDays(30);

        // Delay the first run so migrations and index creation settle first.
        private static readonly TimeSpan InitialDelay = TimeSpan.FromMinutes(5);
        private static readonly TimeSpan RunInterval  = TimeSpan.FromHours(24);

        public DatabaseCleanupService(
            IServiceScopeFactory scopeFactory,
            ILogger<DatabaseCleanupService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger       = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation(
                "DatabaseCleanupService started. First run in {Min} min.", InitialDelay.TotalMinutes);

            await Task.Delay(InitialDelay, stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await RunCleanupAsync(stoppingToken);
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    _logger.LogError(ex, "DatabaseCleanupService: cleanup cycle failed.");
                }

                await Task.Delay(RunInterval, stoppingToken);
            }
        }

        private async Task RunCleanupAsync(CancellationToken ct)
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            // ── DB-01: SyncOutboxEntries ──────────────────────────────────────
            // Synced and Failed entries are no longer needed after 7 days.
            var outboxCutoff = DateTime.UtcNow - OutboxRetention;
            int outboxDeleted = await db.SyncOutboxEntries
                .Where(e => (e.Status == "Synced" || e.Status == "Failed")
                         && e.CreatedAt < outboxCutoff)
                .ExecuteDeleteAsync(ct);

            if (outboxDeleted > 0)
                _logger.LogInformation("DB-01: deleted {N} stale outbox entries.", outboxDeleted);

            // ── DB-02: Notifications ──────────────────────────────────────────
            // Read notifications expire after 90 days; all notifications after 180 days.
            var notifReadCutoff = DateTime.UtcNow - NotificationReadRetention;
            int notifRead = await db.Notifications
                .Where(n => n.IsRead && n.CreatedAt < notifReadCutoff)
                .ExecuteDeleteAsync(ct);

            var notifAllCutoff = DateTime.UtcNow - NotificationAllRetention;
            int notifAll = await db.Notifications
                .Where(n => n.CreatedAt < notifAllCutoff)
                .ExecuteDeleteAsync(ct);

            if (notifRead + notifAll > 0)
                _logger.LogInformation(
                    "DB-02: deleted {N} notifications ({R} read-expired + {A} hard-expired).",
                    notifRead + notifAll, notifRead, notifAll);

            // ── DB-03: Reminders ──────────────────────────────────────────────
            // Fired reminders are historical artefacts; prune after 30 days.
            var reminderCutoff = DateTime.UtcNow - ReminderRetention;
            int remindersDeleted = await db.Reminders
                .Where(r => r.HasFired && r.FiredAt < reminderCutoff)
                .ExecuteDeleteAsync(ct);

            if (remindersDeleted > 0)
                _logger.LogInformation("DB-03: deleted {N} fired reminders.", remindersDeleted);

            // ── DB-04: ChatbotConversations + ChatbotMessages ─────────────────
            // SQLite FK cascades are OFF by default; delete child rows (messages) first.
            var chatCutoff = DateTime.UtcNow - ChatRetention;

            int chatMsgs = await db.ChatbotMessages
                .Where(m => m.Conversation.UpdatedAt < chatCutoff)
                .ExecuteDeleteAsync(ct);

            int chats = await db.ChatbotConversations
                .Where(c => c.UpdatedAt < chatCutoff)
                .ExecuteDeleteAsync(ct);

            if (chats > 0)
                _logger.LogInformation(
                    "DB-04: deleted {C} stale conversations ({M} messages).", chats, chatMsgs);

            // ── DB-05: Messages (tombstones) ──────────────────────────────────
            // Messages soft-deleted by both parties can be hard-deleted after 30 days.
            var msgCutoff = DateTime.UtcNow - MessageTombstoneRetention;
            int msgsDeleted = await db.Messages
                .Where(m => m.IsDeletedBySender && m.IsDeletedByReceiver && m.SentAt < msgCutoff)
                .ExecuteDeleteAsync(ct);

            if (msgsDeleted > 0)
                _logger.LogInformation("DB-05: hard-deleted {N} tombstoned messages.", msgsDeleted);

            // ── DB-06: LocalInvitations ───────────────────────────────────────
            // Non-Pending rows that are past their ExpiresAt and older than 30 days.
            var invCutoff = DateTime.UtcNow - InvitationCacheRetention;
            int invDeleted = await db.LocalInvitations
                .Where(i => i.Status != "Pending"
                         && (i.ExpiresAt == null || i.ExpiresAt < DateTime.UtcNow)
                         && i.CachedAt < invCutoff)
                .ExecuteDeleteAsync(ct);

            if (invDeleted > 0)
                _logger.LogInformation("DB-06: pruned {N} resolved local invitations.", invDeleted);
        }
    }
}
