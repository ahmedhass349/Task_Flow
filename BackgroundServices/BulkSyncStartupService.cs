// FILE: BackgroundServices/BulkSyncStartupService.cs  PHASE: 2  CHANGE: uses SyncId as _id for ISyncableEntity collections; added ToBsonDocumentSyncable helper
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
    /// Runs once at startup: waits for MongoDB to come online, then bulk-upserts
    /// all existing SQLite entities so every collection is created and populated.
    /// </summary>
    public class BulkSyncStartupService : BackgroundService
    {
        private readonly MongoService _mongo;
        private readonly IConnectivityService _connectivity;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<BulkSyncStartupService> _logger;

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
            // Wait up to 90 s for MongoDB to be confirmed online (ping runs every 30 s by default).
            for (int i = 0; i < 18 && !stoppingToken.IsCancellationRequested; i++)
            {
                if (_connectivity.IsEffectivelyOnline) break;
                await Task.Delay(5_000, stoppingToken).ContinueWith(_ => { });
            }

            if (!_connectivity.IsEffectivelyOnline)
            {
                _logger.LogWarning("BulkSyncStartupService: MongoDB not reachable on startup – skipping bulk sync.");
                return;
            }

            _logger.LogInformation("BulkSyncStartupService: starting bulk sync of all SQLite entities to MongoDB...");

            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                await SyncAsync(db.AppUsers.AsNoTracking(), "users",
                    u => u.Id, u => u, stoppingToken);

                await SyncSyncableAsync(db.Projects.AsNoTracking(), "projects",
                    p => p.Id, stoppingToken);

                await SyncSyncableAsync(db.TaskItems.AsNoTracking(), "tasks",
                    t => t.Id, stoppingToken);

                await SyncAsync(db.TaskComments.AsNoTracking(), "task_comments",
                    c => c.Id, c => c, stoppingToken);

                await SyncAsync(db.Teams.AsNoTracking(), "teams",
                    t => t.Id, t => t, stoppingToken);

                await SyncAsync(db.Messages.AsNoTracking(), "messages",
                    m => m.Id, m => m, stoppingToken);

                await SyncSyncableAsync(db.Notifications.AsNoTracking(), "notifications",
                    n => n.Id, stoppingToken);

                await SyncSyncableAsync(db.Reminders.AsNoTracking(), "reminders",
                    r => r.Id, stoppingToken);

                await SyncAsync(db.CalendarEvents.AsNoTracking(), "calendar_events",
                    e => e.Id, e => e, stoppingToken);

                await SyncAsync(db.ChatbotConversations.AsNoTracking(), "chatbot_conversations",
                    c => c.Id, c => c, stoppingToken);

                await SyncAsync(db.ChatbotMessages.AsNoTracking(), "chatbot_messages",
                    m => m.Id, m => m, stoppingToken);

                // Composite-PK entities: use synthetic id = parentId * 1_000_000 + userId
                await SyncAsync(db.ProjectMembers.AsNoTracking(), "project_members",
                    pm => pm.ProjectId * 1_000_000 + pm.UserId, pm => pm, stoppingToken);

                await SyncAsync(db.TeamMembers.AsNoTracking(), "team_member_records",
                    tm => tm.TeamId * 1_000_000 + tm.UserId, tm => tm, stoppingToken);

                _logger.LogInformation("BulkSyncStartupService: bulk sync complete.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "BulkSyncStartupService: bulk sync failed.");
            }
        }

        private async Task SyncAsync<T>(
            IQueryable<T> query,
            string collectionName,
            Func<T, int> idSelector,
            Func<T, object> entitySelector,
            CancellationToken ct) where T : class
        {
            try
            {
                var entities = await query.ToListAsync(ct);
                int count = 0;
                foreach (var entity in entities)
                {
                    if (ct.IsCancellationRequested) break;
                    int id = idSelector(entity);
                    var doc = ToBsonDocument(entitySelector(entity), id);
                    await _mongo.UpsertDocumentAsync(collectionName, id, doc);
                    count++;
                }
                _logger.LogInformation("BulkSync: {Col} → {N} documents upserted", collectionName, count);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "BulkSync: failed for collection {Col}", collectionName);
            }
        }

        /// <summary>Phase 2: syncs entities that implement ISyncableEntity using SyncId as MongoDB _id.</summary>
        private async Task SyncSyncableAsync<T>(
            IQueryable<T> query,
            string collectionName,
            Func<T, int> idSelector,
            CancellationToken ct) where T : class, ISyncableEntity
        {
            try
            {
                var entities = await query.ToListAsync(ct);
                int count = 0;
                foreach (var entity in entities)
                {
                    if (ct.IsCancellationRequested) break;
                    int intId = idSelector(entity);
                    var syncId = entity.SyncId == Guid.Empty ? Guid.NewGuid() : entity.SyncId;
                    var doc = ToBsonDocumentSyncable(entity, syncId, intId);
                    await _mongo.UpsertDocumentBySyncIdAsync(collectionName, syncId.ToString(), intId, doc);
                    count++;
                }
                _logger.LogInformation("BulkSync (SyncId): {Col} → {N} documents upserted", collectionName, count);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "BulkSync: failed for collection {Col}", collectionName);
            }
}

        private static BsonDocument ToBsonDocument(object entity, int id)
        {
            try
            {
                var json = JsonSerializer.Serialize(entity, JsonOpts);
                var bson = new BsonDocument { ["_id"] = id };
                using var doc = JsonDocument.Parse(json);
                foreach (var prop in doc.RootElement.EnumerateObject())
                {
                    if (prop.Name.Equals("id", StringComparison.OrdinalIgnoreCase)) continue;
                    bson[prop.Name] = ToBsonValue(prop.Value);
                }
                return bson;
            }
            catch
            {
                return new BsonDocument { ["_id"] = id };
            }
        }

        /// <summary>Phase 2: serialises an ISyncableEntity with _id = syncId (string) and intId = int PK.</summary>
        private static BsonDocument ToBsonDocumentSyncable(object entity, Guid syncId, int intId)
        {
            try
            {
                var json = JsonSerializer.Serialize(entity, JsonOpts);
                var bson = new BsonDocument { ["_id"] = syncId.ToString(), ["intId"] = intId };
                using var doc = JsonDocument.Parse(json);
                foreach (var prop in doc.RootElement.EnumerateObject())
                {
                    if (prop.Name.Equals("id", StringComparison.OrdinalIgnoreCase)) continue;
                    bson[prop.Name] = ToBsonValue(prop.Value);
                }
                return bson;
            }
            catch
            {
                return new BsonDocument { ["_id"] = syncId.ToString(), ["intId"] = intId };
            }
}

        private static BsonValue ToBsonValue(JsonElement el)
        {
            return el.ValueKind switch
            {
                JsonValueKind.Null or JsonValueKind.Undefined => BsonNull.Value,
                JsonValueKind.True => (BsonValue)true,
                JsonValueKind.False => (BsonValue)false,
                JsonValueKind.Number =>
                    el.TryGetInt64(out var l) ? (BsonValue)(long)l :
                    el.TryGetDouble(out var d) ? (BsonValue)(double)d : BsonNull.Value,
                JsonValueKind.String =>
                    DateTime.TryParse(el.GetString(),
                        System.Globalization.CultureInfo.InvariantCulture,
                        System.Globalization.DateTimeStyles.RoundtripKind, out var dt)
                        ? (BsonValue)dt
                        : (BsonValue)(el.GetString() ?? string.Empty),
                JsonValueKind.Array => new BsonArray(),
                JsonValueKind.Object => new BsonDocument(),
                _ => BsonNull.Value,
            };
        }
    }
}
