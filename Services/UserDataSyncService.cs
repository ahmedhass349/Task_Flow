/*
  FILE: Services/UserDataSyncService.cs
  PHASE: 2
  MISSION: 1-CrossMachine
  CHANGES:
    - PullForUserAsync: looks up the user's email from SQLite at the start; passes it to all
      Pull methods. This fixes the critical cross-machine bug where MongoDB was queried with a
      device-local integer PK (P2.1).
    - PullTasksAsync: filter changed from "assigneeId" (int) → OR filter covering assigneeEmail
      AND createdByEmail (both camelCase for new docs and PascalCase for pre-fix legacy docs).
      Sets AssigneeEmail on the mapped TaskItem.
    - MapToTaskItem: added CreatedByEmail field read (tries camelCase first, then PascalCase
      for backward compatibility with documents written before [JsonPropertyName] was added).
    - PullProjectsAsync: filter changed from "ownerId" (int) → "ownerEmail" (string); sets
      OwnerEmail on the mapped Project.
    - Added PullNotificationsAsync: filter by "userEmail"; inserts missing notifications; updates
      read-status (IsRead, ReadAt) when MongoDB shows read=true and local shows read=false (P2.2).
    - Added PullCalendarEventsAsync: filter by "ownerEmail"; inserts missing events by SyncId (P2.3).
    - Added MapToNotification and MapToCalendarEvent helpers.
    - Email normalization: Trim + ToLowerInvariant applied to all per-login queries so case
      mismatches between machines never silently drop results.
    - PullTasksAsync AssigneeId FK repair: after finding a task by SyncId, repair the integer
      AssigneeId to the local machine's user Id (fixes Machine A int PK copied to Machine B).
*/
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
                // Phase 2: resolve stable cross-device key (email) once for all Pull methods.
                // All downstream MongoDB filters use email, not the device-local integer PK.
                string? userEmail = null;
                using (var scope = _scopeFactory.CreateScope())
                {
                    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    var user = await db.AppUsers.AsNoTracking()
                        .FirstOrDefaultAsync(u => u.Id == userId, ct);
                    // DEFECT 3 FIX: normalize email before using as MongoDB filter.
                    // Without normalization, whitespace or mixed-case from SQLite can
                    // cause MongoDB string filters to return no results on Machine B.
                    userEmail = user?.Email?.Trim().ToLowerInvariant();
                }

                if (string.IsNullOrEmpty(userEmail))
                {
                    _logger.LogWarning("UserDataSyncService: could not resolve email for userId={UserId}; skipping pull.", userId);
                    return;
                }

                await PullTasksAsync(userId, userEmail, ct);
                await PullProjectsAsync(userId, userEmail, ct);
                await PullNotificationsAsync(userId, userEmail, ct);
                await PullCalendarEventsAsync(userId, userEmail, ct);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "UserDataSyncService.PullForUserAsync failed for userId={UserId}", userId);
            }
        }

        // ── Tasks ─────────────────────────────────────────────────────────────

        private async Task PullTasksAsync(int userId, string userEmail, CancellationToken ct)
        {
            // Phase 2 fix: query by email (stable cross-device key) not integer id.
            // OR filter covers:
            //   - assigneeEmail / AssigneeEmail — tasks assigned to this user
            //   - createdByEmail / CreatedByEmail — tasks created by this user (may be assigned to a team member)
            // The dual casing (camel + Pascal) provides backward compatibility with documents written
            // before [JsonPropertyName] attributes were added to TaskItem (MirrorService used PascalCase).
            var filter = new BsonDocument("$or", new BsonArray
            {
                new BsonDocument("assigneeEmail", userEmail),
                new BsonDocument("AssigneeEmail", userEmail),
                new BsonDocument("createdByEmail", userEmail),
                new BsonDocument("CreatedByEmail", userEmail),
            });
            var docs = await _mongo.FindDocumentsAsync("tasks", filter, ct);

            if (docs.Count == 0) return;

            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            foreach (var doc in docs)
            {
                if (ct.IsCancellationRequested) break;

                if (!doc.Contains("_id") || doc["_id"].BsonType != BsonType.String) continue;

                if (!Guid.TryParse(doc["_id"].AsString, out var syncId)) continue;

                // DEFECT 3 FIX: repair the machine-local AssigneeId FK that BulkSync may have
                // copied verbatim from MongoDB (where it was Machine A's integer PK, e.g. 5).
                // On Machine B the same user has a different integer Id (e.g. 3).
                // Tasks with the wrong FK don't appear in Machine B's task queries.
                var existing = await db.TaskItems.FirstOrDefaultAsync(t => t.SyncId == syncId, ct);
                if (existing != null)
                {
                    if (existing.AssigneeId != userId)
                        existing.AssigneeId = userId;
                    continue;
                }

                var task = MapToTaskItem(doc, syncId, userId, userEmail);
                db.TaskItems.Add(task);
            }

            await db.SaveChangesAsync(ct);
        }

        // ── Projects ──────────────────────────────────────────────────────────

        private async Task PullProjectsAsync(int userId, string userEmail, CancellationToken ct)
        {
            // Phase 2 fix: query by email (stable cross-device key) not integer id
            var filter = new BsonDocument("ownerEmail", userEmail);
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

                var project = MapToProject(doc, syncId, userId, userEmail);
                db.Projects.Add(project);
            }

            await db.SaveChangesAsync(ct);
        }

        // ── Notifications ─────────────────────────────────────────────────────

        private async Task PullNotificationsAsync(int userId, string userEmail, CancellationToken ct)
        {
            var filter = new BsonDocument("userEmail", userEmail);
            var docs = await _mongo.FindDocumentsAsync("notifications", filter, ct);

            if (docs.Count == 0) return;

            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            foreach (var doc in docs)
            {
                if (ct.IsCancellationRequested) break;

                if (!doc.Contains("_id") || doc["_id"].BsonType != BsonType.String) continue;

                if (!Guid.TryParse(doc["_id"].AsString, out var syncId)) continue;

                var existing = await db.Notifications
                    .FirstOrDefaultAsync(n => n.SyncId == syncId, ct);

                if (existing != null)
                {
                    // Sync read-status: if MongoDB says read but local still unread, update local
                    bool mongoIsRead = GetBool(doc, "isRead");
                    if (mongoIsRead && !existing.IsRead)
                    {
                        existing.IsRead = true;
                        existing.ReadAt = GetDateTimeOrNull(doc, "readAt") ?? DateTime.UtcNow;
                    }
                    continue;
                }

                var notification = MapToNotification(doc, syncId, userId, userEmail);
                db.Notifications.Add(notification);
            }

            await db.SaveChangesAsync(ct);
        }

        // ── Calendar Events ───────────────────────────────────────────────────

        private async Task PullCalendarEventsAsync(int userId, string userEmail, CancellationToken ct)
        {
            var filter = new BsonDocument("ownerEmail", userEmail);
            var docs = await _mongo.FindDocumentsAsync("calendar_events", filter, ct);

            if (docs.Count == 0) return;

            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            foreach (var doc in docs)
            {
                if (ct.IsCancellationRequested) break;

                if (!doc.Contains("_id") || doc["_id"].BsonType != BsonType.String) continue;

                if (!Guid.TryParse(doc["_id"].AsString, out var syncId)) continue;

                bool exists = await db.CalendarEvents.AnyAsync(e => e.SyncId == syncId, ct);
                if (exists) continue;

                var calendarEvent = MapToCalendarEvent(doc, syncId, userId, userEmail);
                db.CalendarEvents.Add(calendarEvent);
            }

            await db.SaveChangesAsync(ct);
        }

        // ── Mappers ───────────────────────────────────────────────────────────

        private static TaskItem MapToTaskItem(BsonDocument doc, Guid syncId, int userId, string userEmail)
        {
            return new TaskItem
            {
                SyncId         = syncId,
                Title          = GetString(doc, "title", "Untitled"),
                Description    = GetStringOrNull(doc, "description"),
                AssigneeId     = userId,
                AssigneeEmail  = userEmail,  // Phase 2
                CreatedByEmail = GetStringOrNull(doc, "createdByEmail") ?? GetStringOrNull(doc, "CreatedByEmail"),
                ProjectId      = GetIntOrNull(doc, "projectId"),
                Priority       = GetEnum(doc, "priority", TaskPriority.Medium),
                Status         = GetEnum(doc, "status", taskflow.Data.Entities.TaskStatus.Todo),
                DueDate        = GetDateTimeOrNull(doc, "dueDate"),
                IsStarred      = GetBool(doc, "isStarred"),
                CreatedAt      = GetDateTime(doc, "createdAt"),
                UpdatedAt      = GetDateTime(doc, "updatedAt"),
                IsSynced       = true,
                LastModifiedBy = GetStringOrNull(doc, "lastModifiedBy"),
            };
        }

        private static Project MapToProject(BsonDocument doc, Guid syncId, int userId, string userEmail)
        {
            return new Project
            {
                SyncId      = syncId,
                Name        = GetString(doc, "name", "Untitled Project"),
                Description = GetStringOrNull(doc, "description"),
                OwnerId     = userId,
                OwnerEmail  = userEmail,  // Phase 2
                Color       = GetStringOrNull(doc, "color"),
                CreatedAt   = GetDateTime(doc, "createdAt"),
                UpdatedAt   = GetDateTime(doc, "updatedAt"),
                IsSynced    = true,
            };
        }

        private static Notification MapToNotification(BsonDocument doc, Guid syncId, int userId, string userEmail)
        {
            return new Notification
            {
                SyncId        = syncId,
                UserId        = userId,
                UserEmail     = userEmail,  // Phase 2
                Title         = GetString(doc, "title", "Notification"),
                Message       = GetString(doc, "message", string.Empty),
                Type          = GetEnum(doc, "type", NotificationType.TaskCreated),
                Priority      = GetEnum(doc, "priority", NotificationPriority.Low),
                IsRead        = GetBool(doc, "isRead"),
                ReadAt        = GetDateTimeOrNull(doc, "readAt"),
                ActionUrl     = GetStringOrNull(doc, "actionUrl"),
                RelatedTaskId = GetIntOrNull(doc, "relatedTaskId"),
                CreatedAt     = GetDateTime(doc, "createdAt"),
                UpdatedAt     = GetDateTime(doc, "updatedAt"),
                IsSynced      = true,
            };
        }

        private static CalendarEvent MapToCalendarEvent(BsonDocument doc, Guid syncId, int userId, string userEmail)
        {
            return new CalendarEvent
            {
                SyncId      = syncId,
                OwnerId     = userId,
                OwnerEmail  = userEmail,  // Phase 2
                Title       = GetString(doc, "title", "Untitled Event"),
                Description = GetStringOrNull(doc, "description"),
                StartAt     = GetDateTime(doc, "startAt"),
                EndAt       = GetDateTime(doc, "endAt"),
                Color       = GetStringOrNull(doc, "color"),
                MeetingLink = GetStringOrNull(doc, "meetingLink"),
                CreatedAt   = GetDateTime(doc, "createdAt"),
                UpdatedAt   = GetDateTime(doc, "updatedAt"),
                IsSynced    = true,
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
