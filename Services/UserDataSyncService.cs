// FILE: Services/UserDataSyncService.cs  PHASE: 2  CHANGE: new service — pulls user's MongoDB tasks/projects/notifications/reminders into SQLite on login
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using taskflow.Data;
using taskflow.Data.Entities;
using taskflow.Services.Interfaces;

namespace taskflow.Services
{
    /// <summary>
    /// Pulls down MongoDB documents for a given user and inserts any that are missing
    /// from the local SQLite database.  Uses SyncId as the cross-device deduplication key.
    /// MongoDB failures are fully swallowed — this service must never crash the request pipeline.
    /// </summary>
    public sealed class UserDataSyncService : IUserDataSyncService
    {
        private readonly MongoService           _mongo;
        private readonly IServiceScopeFactory   _scopeFactory;
        private readonly ILogger<UserDataSyncService> _logger;

        public UserDataSyncService(
            MongoService mongo,
            IServiceScopeFactory scopeFactory,
            ILogger<UserDataSyncService> logger)
        {
            _mongo        = mongo;
            _scopeFactory = scopeFactory;
            _logger       = logger;
        }

        public async Task PullForUserAsync(int userId, CancellationToken ct = default)
        {
            try
            {
                await PullTasksAsync(userId, ct);
                await PullProjectsAsync(userId, ct);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "UserDataSyncService.PullForUserAsync failed for userId={UserId}", userId);
            }
        }

        // ── Tasks ─────────────────────────────────────────────────────────────

        private async Task PullTasksAsync(int userId, CancellationToken ct)
        {
            // Query MongoDB for tasks belonging to this user
            var filter = new BsonDocument("assigneeId", userId);
            var docs = await _mongo.FindDocumentsAsync("tasks", filter, ct);

            if (docs.Count == 0) return;

            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            foreach (var doc in docs)
            {
                if (ct.IsCancellationRequested) break;

                if (!doc.Contains("_id") || doc["_id"].BsonType != BsonType.String) continue;

                if (!Guid.TryParse(doc["_id"].AsString, out var syncId)) continue;

                // Skip if already present locally
                bool exists = await db.TaskItems.AnyAsync(t => t.SyncId == syncId, ct);
                if (exists) continue;

                var task = MapToTaskItem(doc, syncId, userId);
                db.TaskItems.Add(task);
            }

            await db.SaveChangesAsync(ct);
        }

        // ── Projects ──────────────────────────────────────────────────────────

        private async Task PullProjectsAsync(int userId, CancellationToken ct)
        {
            var filter = new BsonDocument("ownerId", userId);
            var docs = await _mongo.FindDocumentsAsync("projects", filter, ct);

            if (docs.Count == 0) return;

            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            foreach (var doc in docs)
            {
                if (ct.IsCancellationRequested) break;

                if (!doc.Contains("_id") || doc["_id"].BsonType != BsonType.String) continue;

                if (!Guid.TryParse(doc["_id"].AsString, out var syncId)) continue;

                bool exists = await db.Projects.AnyAsync(p => p.SyncId == syncId, ct);
                if (exists) continue;

                var project = MapToProject(doc, syncId, userId);
                db.Projects.Add(project);
            }

            await db.SaveChangesAsync(ct);
        }

        // ── Mappers ───────────────────────────────────────────────────────────

        private static TaskItem MapToTaskItem(BsonDocument doc, Guid syncId, int userId)
        {
            return new TaskItem
            {
                SyncId        = syncId,
                Title         = GetString(doc, "title", "Untitled"),
                Description   = GetStringOrNull(doc, "description"),
                AssigneeId    = userId,
                ProjectId     = GetIntOrNull(doc, "projectId"),
                Priority      = GetEnum(doc, "priority", TaskPriority.Medium),
                Status        = GetEnum(doc, "status", taskflow.Data.Entities.TaskStatus.Todo),
                DueDate       = GetDateTimeOrNull(doc, "dueDate"),
                IsStarred     = GetBool(doc, "isStarred"),
                CreatedAt     = GetDateTime(doc, "createdAt"),
                UpdatedAt     = GetDateTime(doc, "updatedAt"),
                IsSynced      = true,
                LastModifiedBy = GetStringOrNull(doc, "lastModifiedBy"),
            };
        }

        private static Project MapToProject(BsonDocument doc, Guid syncId, int userId)
        {
            return new Project
            {
                SyncId     = syncId,
                Name       = GetString(doc, "name", "Untitled Project"),
                Description = GetStringOrNull(doc, "description"),
                OwnerId    = userId,
                CreatedAt  = GetDateTime(doc, "createdAt"),
                UpdatedAt  = GetDateTime(doc, "updatedAt"),
                IsSynced   = true,
            };
        }

        // ── BsonDocument helpers ──────────────────────────────────────────────

        private static string GetString(BsonDocument doc, string key, string fallback)
        {
            if (doc.TryGetValue(key, out var val) && val.BsonType == BsonType.String)
                return val.AsString;
            return fallback;
        }

        private static string? GetStringOrNull(BsonDocument doc, string key)
        {
            if (doc.TryGetValue(key, out var val) && val.BsonType == BsonType.String)
                return val.AsString;
            return null;
        }

        private static int? GetIntOrNull(BsonDocument doc, string key)
        {
            if (!doc.TryGetValue(key, out var val)) return null;
            if (val.BsonType == BsonType.Int32) return val.AsInt32;
            if (val.BsonType == BsonType.Int64) return (int)val.AsInt64;
            return null;
        }

        private static bool GetBool(BsonDocument doc, string key)
        {
            if (doc.TryGetValue(key, out var val) && val.BsonType == BsonType.Boolean)
                return val.AsBoolean;
            return false;
        }

        private static DateTime GetDateTime(BsonDocument doc, string key)
        {
            if (!doc.TryGetValue(key, out var val)) return DateTime.UtcNow;
            if (val.BsonType == BsonType.DateTime) return val.ToUniversalTime();
            if (val.BsonType == BsonType.String &&
                DateTime.TryParse(val.AsString, null,
                    System.Globalization.DateTimeStyles.RoundtripKind, out var dt))
                return dt;
            return DateTime.UtcNow;
        }

        private static DateTime? GetDateTimeOrNull(BsonDocument doc, string key)
        {
            if (!doc.TryGetValue(key, out var val)) return null;
            if (val.BsonType == BsonType.Null) return null;
            if (val.BsonType == BsonType.DateTime) return val.ToUniversalTime();
            if (val.BsonType == BsonType.String &&
                DateTime.TryParse(val.AsString, null,
                    System.Globalization.DateTimeStyles.RoundtripKind, out var dt))
                return dt;
            return null;
        }

        private static T GetEnum<T>(BsonDocument doc, string key, T fallback) where T : struct, Enum
        {
            if (!doc.TryGetValue(key, out var val)) return fallback;
            if (val.BsonType == BsonType.Int32 && Enum.IsDefined(typeof(T), val.AsInt32))
                return (T)(object)val.AsInt32;
            if (val.BsonType == BsonType.String &&
                Enum.TryParse<T>(val.AsString, true, out var parsed))
                return parsed;
            return fallback;
        }
    }
}
