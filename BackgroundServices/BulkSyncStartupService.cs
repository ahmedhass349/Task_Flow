/*
  FILE: BackgroundServices/BulkSyncStartupService.cs
  PHASE: 2 & 3
  DEFECT: 3-Persistence, 1-Injection
  CHANGES:
    - PullSyncableAsync: added empty-list deletion guard. If MongoDB returns 0 GUID-keyed
      documents but SQLite has records with valid SyncIds, the response is treated as a
      suspicious partial/empty result (common on Machine B flaky connection) and the entire
      reconciliation step is skipped, preventing mass deletion of local data.
    - ReconcileUsersAsync: extended candidates to also include IsBackedUpToMongo == false
      users older than 2 hours. These are restored+deleted ghost accounts that would otherwise
      escape the reconciliation and remain in SQLite after MongoDB deletion.
    - BackupUnbackedUsersAsync: added AccountExistsInMongoAsync check before each push.
      If the account already exists in MongoDB (e.g. restored from another machine), only
      the local flag is updated — no duplicate push. If absent AND created ≥ 2 hours ago,
      the push is skipped entirely to prevent resurrecting an externally deleted account.
*/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using taskflow.Data;
using taskflow.Data.Entities;
using taskflow.Services;
using taskflow.Services.Interfaces;

namespace taskflow.BackgroundServices
{
    /// <summary>
    /// Runs once at startup: waits for MongoDB to come online, then pulls all
    /// ISyncableEntity collections from MongoDB into SQLite (MongoDB is the source of truth).
    /// Deletions made directly in MongoDB are honoured — absent records are removed from SQLite.
    /// </summary>
    public class BulkSyncStartupService : BackgroundService
    {
        private readonly MongoService _mongo;
        private readonly IConnectivityService _connectivity;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<BulkSyncStartupService> _logger;

        // P6-B1: ensures the full bulk sync runs exactly once — at startup or on first reconnect.
        private int _hasSynced = 0;
        private CancellationToken _stoppingToken;

        private static readonly JsonSerializerOptions JsonOpts = new()
        {
            ReferenceHandler = ReferenceHandler.IgnoreCycles,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        };

        public BulkSyncStartupService(
            MongoService mongo,
            IConnectivityService connectivity,
            IServiceScopeFactory scopeFactory,
            ILogger<BulkSyncStartupService> logger)
        {
            _mongo = mongo;
            _connectivity = connectivity;
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _stoppingToken = stoppingToken;
            // P6-B1: subscribe to ConnectivityChanged for late-start recovery.
            // If MongoDB is still unreachable after the 90-second wait below,
            // RunBulkSyncOnceAsync will be triggered the first time it comes online.
            _connectivity.ConnectivityChanged += OnConnectivityChanged;

            try
            {
                // Wait up to 90 s for MongoDB to be confirmed online (ping runs every 10 s).
                for (int i = 0; i < 18 && !stoppingToken.IsCancellationRequested; i++)
                {
                    if (_connectivity.IsEffectivelyOnline) break;
                    await Task.Delay(5_000, stoppingToken).ContinueWith(_ => { });
                }

                if (_connectivity.IsEffectivelyOnline)
                    await RunBulkSyncOnceAsync(stoppingToken);
                else
                    _logger.LogWarning(
                        "BulkSyncStartupService: MongoDB not reachable on startup — " +
                        "bulk sync deferred until first reconnect.");

                // Keep the service alive so the ConnectivityChanged subscription stays active.
                await Task.Delay(Timeout.Infinite, stoppingToken).ContinueWith(_ => { });
            }
            finally
            {
                _connectivity.ConnectivityChanged -= OnConnectivityChanged;
            }
        }

        // P6-B1: late-start recovery — fires bulk sync the first time MongoDB comes online
        // after the app started offline.  Subsequent reconnects are handled by the outbox.
        private void OnConnectivityChanged(bool isOnline)
        {
            if (!isOnline) return;
            _ = Task.Run(async () =>
            {
                try   { await RunBulkSyncOnceAsync(_stoppingToken); }
                catch (Exception ex)
                { _logger.LogWarning(ex, "BulkSyncStartupService: late-start recovery failed."); }
            }, _stoppingToken);
        }

        // Runs the full pull sync exactly once (guarded by _hasSynced flag).
        // MongoDB is the source of truth; SQLite is a local cache populated FROM MongoDB.
        private async Task RunBulkSyncOnceAsync(CancellationToken stoppingToken)
        {
            // Atomically flip 0 → 1; if the exchange returns 1 it was already set, skip.
            if (Interlocked.CompareExchange(ref _hasSynced, 1, 0) != 0) return;

            _logger.LogInformation("BulkSyncStartupService: starting pull sync (MongoDB → SQLite)...");

            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                // Pull ISyncableEntity collections from MongoDB into SQLite.
                // MongoDB deletions are respected: records absent from MongoDB are removed from SQLite.
                await PullSyncableAsync<Project>(db, db.Projects, "projects", stoppingToken);
                await PullSyncableAsync<TaskItem>(db, db.TaskItems, "tasks", stoppingToken);
                await PullSyncableAsync<Notification>(db, db.Notifications, "notifications", stoppingToken);
                await PullSyncableAsync<Reminder>(db, db.Reminders, "reminders", stoppingToken);
                // Phase 3 (P3.5): CalendarEvent implements ISyncableEntity since Phase 2 migration —
                // pull calendar_events so they are consistent across machines on startup.
                await PullSyncableAsync<CalendarEvent>(db, db.CalendarEvents, "calendar_events", stoppingToken);

                // Reconcile AppUsers against user_accounts: if a user was backed up to MongoDB
                // previously but their credential record no longer exists there (e.g. the account
                // was deleted externally / via Atlas UI), remove the stale SQLite record so they
                // cannot log in on this device with stale cached credentials.
                // Must run BEFORE BackupUnbackedUsersAsync so that offline-registered users
                // (IsBackedUpToMongo == false) are still protected by that flag.
                await ReconcileUsersAsync(db, stoppingToken);

                // Retry credential backups for users that registered while offline.
                // Any AppUser where IsBackedUpToMongo is false means the BackupUserAccountAsync
                // call silently queued to the outbox (or threw) — we push it directly here now
                // that we are confirmed online.
                await BackupUnbackedUsersAsync(db, stoppingToken);

                _logger.LogInformation("BulkSyncStartupService: pull sync complete.");
            }
            catch (Exception ex)
            {
                // P6-B1: reset the flag so the next reconnect can retry if the sync failed.
                Interlocked.Exchange(ref _hasSynced, 0);
                _logger.LogError(ex, "BulkSyncStartupService: pull sync failed.");
            }
        }

        /// <summary>
        /// Removes SQLite <see cref="AppUser"/> records that no longer have a matching entry in
        /// MongoDB's <c>user_accounts</c> collection (the authoritative credential store).
        /// This closes the "stale login" hole: if an account is deleted directly from MongoDB
        /// (bypassing the in-app delete flow), the local copy is cleaned up here so the user
        /// cannot continue to sign in on this device with cached credentials.
        /// <para>
        /// Only users whose <c>IsBackedUpToMongo</c> flag is <c>true</c> are candidates —
        /// offline-registered users that have not been backed up yet are never removed.
        /// </para>
        /// </summary>
        private async Task ReconcileUsersAsync(AppDbContext db, CancellationToken ct)
        {
            try
            {
                // Null → offline; skip rather than incorrectly purging everyone.
                var accountDocs = await _mongo.GetAllDocumentsAsync("user_accounts", ct);
                if (accountDocs == null) return;

                var validEmails = new HashSet<string>(
                    accountDocs
                        .Where(d => d.Contains("email"))
                        .Select(d => d["email"].AsString.Trim().ToLowerInvariant()),
                    StringComparer.OrdinalIgnoreCase);

                // Only consider users that have previously been backed up to MongoDB.
                // IsBackedUpToMongo == false means the account was created while offline and
                // hasn't been pushed yet — BackupUnbackedUsersAsync will handle that shortly.
                var backedUpCandidates = await db.AppUsers
                    .Where(u => u.IsBackedUpToMongo)
                    .ToListAsync(ct);

                // DEFECT 1 FIX: also check offline-registered users older than 2 hours.
                // Scenario: account created offline → restored on Machine B (sets flag = false) →
                // admin deletes from MongoDB → Machine B startup still has the local record.
                // These are stale ghost accounts — reconcile them against MongoDB too.
                var cutoff = DateTime.UtcNow.AddHours(-2);
                var unsyncedOld = await db.AppUsers
                    .Where(u => !u.IsBackedUpToMongo && u.CreatedAt < cutoff)
                    .ToListAsync(ct);

                var candidates = backedUpCandidates.Concat(unsyncedOld).ToList();

                var toDelete = candidates
                    .Where(u => !validEmails.Contains(u.Email.Trim().ToLowerInvariant()))
                    .ToList();

                if (toDelete.Count == 0) return;

                _logger.LogInformation(
                    "BulkSync: removing {N} user(s) whose credential backup no longer exists in MongoDB.",
                    toDelete.Count);

                db.AppUsers.RemoveRange(toDelete);
                await db.SaveChangesAsync(ct);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "BulkSync: ReconcileUsersAsync failed");
            }
        }

        /// <summary>
        /// Pushes BCrypt credentials to MongoDB for any AppUser that was created while offline
        /// (i.e. <c>IsBackedUpToMongo == false</c>). Called once at startup after connectivity
        /// is confirmed, so reinstall-login works for those accounts from this point forward.
        /// </summary>
        private async Task BackupUnbackedUsersAsync(AppDbContext db, CancellationToken ct)
        {
            try
            {
                var unsynced = await db.AppUsers
                    .Where(u => !u.IsBackedUpToMongo)
                    .AsNoTracking()
                    .ToListAsync(ct);

                if (unsynced.Count == 0) return;

                _logger.LogInformation(
                    "BulkSync: found {N} user(s) not yet backed up to MongoDB — retrying now.", unsynced.Count);

                foreach (var u in unsynced)
                {
                    if (ct.IsCancellationRequested) break;
                    try
                    {
                        // DEFECT 1 INJECTION GUARD: check whether the account already exists in
                        // MongoDB before pushing.  Three cases:
                        // 1. Exists → already backed up (e.g. restored from another machine).
                        //    Just flip the local flag; no write needed.
                        // 2. Absent AND created < 2 hours ago → genuinely new offline registration.
                        //    Push credentials to MongoDB as normal.
                        // 3. Absent AND created ≥ 2 hours ago → likely a restored+deleted account.
                        //    Skip to avoid resurrecting an account that was externally deleted.
                        bool existsInMongo = await _mongo.AccountExistsInMongoAsync(u.Email);

                        if (!existsInMongo && u.CreatedAt < DateTime.UtcNow.AddHours(-2))
                        {
                            _logger.LogWarning(
                                "BulkSync: skipping credential backup for user {Id} ({Email}) — " +
                                "account absent from MongoDB and was created {Age:F0}h ago " +
                                "(possible external deletion).",
                                u.Id, u.Email, (DateTime.UtcNow - u.CreatedAt).TotalHours);
                            continue;
                        }

                        if (!existsInMongo)
                        {
                            await _mongo.BackupUserAccountAsync(u.Email, u.PasswordHash, u.Id);
                        }

                        // Update the flag inside a fresh tracked context (covers both push and
                        // already-existed cases so we don't re-check on every subsequent startup).
                        using var scope = _scopeFactory.CreateScope();
                        var tracked = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                        var entity = await tracked.AppUsers.FindAsync(new object[] { u.Id }, ct);
                        if (entity != null)
                        {
                            entity.IsBackedUpToMongo = true;
                            await tracked.SaveChangesAsync(ct);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "BulkSync: credential backup failed for user {Id}", u.Id);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "BulkSync: BackupUnbackedUsersAsync failed");
            }
        }

        private static readonly JsonSerializerOptions JsonOptsDeserialize = new()
        {
            PropertyNameCaseInsensitive = true,
        };

        /// <summary>
        /// Reconciles one SQLite collection against its MongoDB counterpart:
        /// <list type="bullet">
        ///   <item>Deletes local records whose SyncId is absent from MongoDB (respects MongoDB deletions).</item>
        ///   <item>Updates existing local records when MongoDB has a strictly newer UpdatedAt.</item>
        ///   <item>Inserts records present in MongoDB but not yet in SQLite (cross-device pull).</item>
        /// </list>
        /// Skips without touching SQLite if MongoDB is unreachable.
        /// </summary>
        private async Task PullSyncableAsync<T>(
            AppDbContext db,
            DbSet<T> dbSet,
            string collectionName,
            CancellationToken ct)
            where T : class, ISyncableEntity, new()
        {
            try
            {
                // null = unreachable/error; empty list = genuinely empty collection
                var docs = await _mongo.GetAllDocumentsAsync(collectionName, ct);
                if (docs == null)
                {
                    _logger.LogWarning(
                        "PullSync: {Col} — MongoDB unreachable, skipping reconciliation",
                        collectionName);
                    return;
                }

                // Index MongoDB documents by their SyncId (_id field)
                var mongoSyncIds = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                var docBySyncId = new Dictionary<string, BsonDocument>(StringComparer.OrdinalIgnoreCase);
                foreach (var doc in docs)
                {
                    if (!doc.Contains("_id") || doc["_id"].BsonType != BsonType.String) continue;
                    var syncId = doc["_id"].AsString;
                    if (!Guid.TryParse(syncId, out _)) continue; // ignore non-GUID _id values
                    mongoSyncIds.Add(syncId);
                    docBySyncId[syncId] = doc;
                }

                // Load all tracked SQLite entities for this collection
                var sqliteEntities = await dbSet.ToListAsync(ct);
                var sqliteBySyncId = sqliteEntities.ToDictionary(
                    e => e.SyncId.ToString(), StringComparer.OrdinalIgnoreCase);

                // DEFECT 3 INJECTION GUARD: if MongoDB returned zero GUID-keyed documents but
                // SQLite has records with valid SyncIds, this is a suspicious empty response.
                // On Machine B with a flaky connection, GetAllDocumentsAsync can succeed (return
                // an empty list, not null) while a real collection has data.  Deleting all local
                // records in this case would wipe the user's data.  Skip the reconciliation step
                // entirely — no inserts, no updates, no deletions.
                int localWithSyncIds = sqliteEntities.Count(e => e.SyncId != Guid.Empty);
                if (mongoSyncIds.Count == 0 && localWithSyncIds > 0)
                {
                    _logger.LogWarning(
                        "PullSync: {Col} — MongoDB returned 0 documents but SQLite has {N} record(s) " +
                        "with valid SyncIds.  Skipping reconciliation (suspicious empty response).",
                        collectionName, localWithSyncIds);
                    return;
                }

                // 1. Delete SQLite records whose SyncId is absent from MongoDB
                var toDelete = sqliteEntities
                    .Where(e => e.SyncId != Guid.Empty && !mongoSyncIds.Contains(e.SyncId.ToString()))
                    .ToList();
                if (toDelete.Count > 0)
                {
                    dbSet.RemoveRange(toDelete);
                    _logger.LogInformation(
                        "PullSync: {Col} — removing {N} record(s) deleted from MongoDB",
                        collectionName, toDelete.Count);
                }

                // 2. Update existing and insert new records
                int updatedCount = 0, insertedCount = 0;
                foreach (var (syncId, doc) in docBySyncId)
                {
                    if (ct.IsCancellationRequested) break;

                    if (sqliteBySyncId.TryGetValue(syncId, out var existing))
                    {
                        // Update only when MongoDB version is strictly newer
                        var mongoUpdatedAt = doc.Contains("UpdatedAt")
                            && doc["UpdatedAt"].BsonType == BsonType.DateTime
                            ? doc["UpdatedAt"].ToUniversalTime()
                            : DateTime.MinValue;
                        if (mongoUpdatedAt <= existing.UpdatedAt) continue;

                        var refreshed = BsonToEntityInstance<T>(doc, syncId, existing.Id); // Id from ISyncableEntity
                        if (refreshed == null) continue;
                        db.Entry(existing).CurrentValues.SetValues(refreshed);
                        updatedCount++;
                    }
                    else
                    {
                        // Insert record present in MongoDB but not yet in local SQLite
                        var entity = BsonToEntityInstance<T>(doc, syncId, 0);
                        if (entity == null) continue;
                        dbSet.Add(entity); // Id=0 already set; SQLite auto-assigns the PK
                        insertedCount++;
                    }
                }

                await db.SaveChangesAsync(ct);
                _logger.LogInformation(
                    "PullSync: {Col} — inserted {I}, updated {U}, deleted {D}",
                    collectionName, insertedCount, updatedCount, toDelete.Count);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "PullSync: failed for collection {Col}", collectionName);
            }
        }

        /// <summary>
        /// Reconstructs an <see cref="ISyncableEntity"/> instance from a BsonDocument that was
        /// originally written by <see cref="MirrorService"/> (System.Text.Json → BsonDocument path).
        /// </summary>
        /// <param name="forceId">
        /// Pass the existing SQLite int PK when updating; pass 0 for new inserts so SQLite
        /// auto-assigns a fresh auto-increment value.
        /// </param>
        private static T? BsonToEntityInstance<T>(BsonDocument doc, string syncId, int forceId)
            where T : class, ISyncableEntity, new()
        {
            try
            {
                var dict = new Dictionary<string, object?>();
                dict["Id"] = forceId;
                dict["SyncId"] = syncId;
                foreach (var elem in doc)
                {
                    if (elem.Name == "_id" || elem.Name == "intId") continue;
                    dict[elem.Name] = BsonValueToObject(elem.Value);
                }

                var json = JsonSerializer.Serialize(dict, JsonOpts);
                var entity = JsonSerializer.Deserialize<T>(json, JsonOptsDeserialize);
                if (entity == null) return null;

                // Guard: ensure SyncId is always set even if deserialization yielded Guid.Empty
                if (entity.SyncId == Guid.Empty)
                    entity.SyncId = Guid.Parse(syncId);

                return entity;
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Converts a <see cref="BsonValue"/> to a .NET object suitable for
        /// <see cref="JsonSerializer.Serialize"/> / Deserialize round-trip.
        /// </summary>
        private static object? BsonValueToObject(BsonValue v) => v.BsonType switch
        {
            BsonType.Int32 => (object?)v.AsInt32,
            BsonType.Int64 => (object?)(long)v.AsInt64,
            BsonType.Double => (object?)v.AsDouble,
            BsonType.String => (object?)v.AsString,
            BsonType.Boolean => (object?)v.AsBoolean,
            BsonType.DateTime => (object?)v.ToUniversalTime(),
            BsonType.Null or BsonType.Undefined => null,
            BsonType.ObjectId => (object?)v.AsObjectId.ToString(),
            _ => null,
        };
    }
}
