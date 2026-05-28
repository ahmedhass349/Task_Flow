using System;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
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
    /// Singleton that mirrors every SQLite write to MongoDB.
    /// All calls are fire-and-forget; failures are logged but never thrown.
    /// Offline operations are queued in <see cref="SyncOutboxEntry"/> and replayed
    /// by <see cref="taskflow.BackgroundServices.OfflineSyncService"/> on reconnect.
    /// </summary>
    public class MirrorService : IMirrorService
    {
        private readonly MongoService _mongo;
        private readonly IConnectivityService _connectivity;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<MirrorService> _logger;

        private static readonly JsonSerializerOptions _jsonOpts = new()
        {
            ReferenceHandler = ReferenceHandler.IgnoreCycles,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        };

        public MirrorService(
            MongoService mongo,
            IConnectivityService connectivity,
            IServiceScopeFactory scopeFactory,
            ILogger<MirrorService> logger)
        {
            _mongo = mongo;
            _connectivity = connectivity;
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        // ── Public API ───────────────────────────────────────────────────────

        public void Mirror<T>(string collection, int id, T entity) where T : class
        {
            _ = Task.Run(() => MirrorAsync(collection, id, entity));
        }

        public void Erase(string collection, int id)
        {
            _ = Task.Run(() => EraseAsync(collection, id));
        }
        public void EraseSync(string collection, Guid syncId)
        {
            _ = Task.Run(() => EraseSyncAsync(collection, syncId));
        }
        // ── Internals ────────────────────────────────────────────────────────

        private async Task MirrorAsync<T>(string collection, int id, T entity) where T : class
        {
            try
            {
                if (entity is ISyncableEntity syncable)
                {
                    // Phase 2: use SyncId as MongoDB _id to prevent int-key collisions across devices
                    var syncId = syncable.SyncId == Guid.Empty ? Guid.NewGuid() : syncable.SyncId;
                    if (_connectivity.IsEffectivelyOnline)
                    {
                        var doc = ToSafeBsonDocumentSyncable(entity, syncId, id);
                        await _mongo.UpsertDocumentBySyncIdAsync(collection, syncId.ToString(), id, doc);
                    }
                    else
                    {
                        var doc = ToSafeBsonDocumentSyncable(entity, syncId, id);
                        await QueueOutboxAsync("MirrorUpsert", JsonSerializer.Serialize(new
                        {
                            collection,
                            id,
                            extJson = doc.ToJson(),
                            syncId = syncId.ToString(),
                        }));
                        _connectivity.IncrementPending();
                    }
                }
                else
                {
                    if (_connectivity.IsEffectivelyOnline)
                    {
                        var doc = ToSafeBsonDocument(entity, id);
                        await _mongo.UpsertDocumentAsync(collection, id, doc);
                    }
                    else
                    {
                        var doc = ToSafeBsonDocument(entity, id);
                        await QueueOutboxAsync("MirrorUpsert", JsonSerializer.Serialize(new
                        {
                            collection,
                            id,
                            extJson = doc.ToJson(),
                            syncId = (string?)null,
                        }));
                        _connectivity.IncrementPending();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "MirrorService.MirrorAsync failed: col={Col} id={Id}", collection, id);
            }
        }

        /*
          FILE: Services/MirrorService.cs
          MISSION: 6-Scan
          CHANGES:
            - D-04: EraseAsync now prunes pending MirrorUpsert outbox entries for the
              same collection+id before deleting, preventing outbox replay from
              re-creating a document that has already been deleted.
            - D-04: EraseSyncAsync applies the same pruning by syncId (GUID match is
              globally unique, so Contains is safe and avoids raw SQL).
        */
        private async Task EraseAsync(string collection, int id)
        {
            try
            {
                // D-04: Cancel any pending upsert for this entity so outbox replay
                // cannot re-create it after the hard delete.
                await PrunePendingUpsertsByIntIdAsync(collection, id);

                if (_connectivity.IsEffectivelyOnline)
                {
                    await _mongo.DeleteDocumentAsync(collection, id);
                }
                else
                {
                    await QueueOutboxAsync("MirrorDelete", JsonSerializer.Serialize(new { collection, id, syncId = (string?)null }));
                    _connectivity.IncrementPending();
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "MirrorService.EraseAsync failed: col={Col} id={Id}", collection, id);
            }
        }

        private async Task EraseSyncAsync(string collection, Guid syncId)
        {
            try
            {
                // D-04: Cancel any pending upsert for this syncId so outbox replay
                // cannot re-create it after the hard delete.
                await PrunePendingUpsertsBySyncIdAsync(syncId.ToString());

                if (_connectivity.IsEffectivelyOnline)
                {
                    await _mongo.DeleteDocumentBySyncIdAsync(collection, syncId.ToString());
                }
                else
                {
                    await QueueOutboxAsync("MirrorDelete", JsonSerializer.Serialize(new
                    {
                        collection,
                        id = 0,
                        syncId = syncId.ToString(),
                    }));
                    _connectivity.IncrementPending();
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "MirrorService.EraseSyncAsync failed: col={Col} syncId={SyncId}", collection, syncId);
            }
        }

        /// <summary>
        /// D-04: Removes pending MirrorUpsert entries whose GUID syncId appears in the
        /// payload. GUID uniqueness makes a plain Contains match precise enough.
        /// </summary>
        private async Task PrunePendingUpsertsBySyncIdAsync(string syncId)
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var pruned = await db.SyncOutboxEntries
                .Where(e => e.Status == "Pending"
                         && e.OperationName == "MirrorUpsert"
                         && e.PayloadJson.Contains(syncId))
                .ExecuteDeleteAsync();
            if (pruned > 0)
                _logger.LogDebug("D-04: pruned {Count} stale upsert(s) for syncId={SyncId}", pruned, syncId);
        }

        /// <summary>
        /// D-04: Removes pending MirrorUpsert entries matching collection + int id.
        /// JSON field order from anonymous-type serialisation is deterministic, so
        /// the combined Contains checks are precise.
        /// </summary>
        private async Task PrunePendingUpsertsByIntIdAsync(string collection, int id)
        {
            var colFragment = $"\"collection\":\"{collection}\"";
            var idFragment  = $"\"id\":{id},";
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var pruned = await db.SyncOutboxEntries
                .Where(e => e.Status == "Pending"
                         && e.OperationName == "MirrorUpsert"
                         && e.PayloadJson.Contains(colFragment)
                         && e.PayloadJson.Contains(idFragment)
                         && e.PayloadJson.Contains("\"syncId\":null"))
                .ExecuteDeleteAsync();
            if (pruned > 0)
                _logger.LogDebug("D-04: pruned {Count} stale upsert(s) for col={Col} id={Id}", pruned, collection, id);
        }

        private static BsonDocument ToSafeBsonDocument<T>(T entity, int id) where T : class
        {
            try
            {
                // Use System.Text.Json to get a flat JSON then parse as BSON
                // ReferenceHandler.IgnoreCycles handles circular navigation props
                var json = JsonSerializer.Serialize(entity, _jsonOpts);

                // Convert ISO 8601 dates so that MongoDB Extended JSON parse works
                // BsonDocument.Parse handles {"$date":"..."} extended JSON — so we
                // round-trip via JSON and build a BsonDocument manually
                var bson = new BsonDocument();
                bson["_id"] = id;

                using var doc = System.Text.Json.JsonDocument.Parse(json);
                foreach (var prop in doc.RootElement.EnumerateObject())
                {
                    if (prop.Name.Equals("id", StringComparison.OrdinalIgnoreCase))
                        continue; // _id already set above

                    bson[prop.Name] = JsonElementToBsonValue(prop.Value);
                }

                return bson;
            }
            catch
            {
                // Fallback: minimal document with just the id
                return new BsonDocument { ["_id"] = id };
            }
        }

        /// <summary>Phase 2: builds a BsonDocument with _id = syncId (string) and intId = SQLite int PK.</summary>
        private static BsonDocument ToSafeBsonDocumentSyncable<T>(T entity, Guid syncId, int intId) where T : class
        {
            try
            {
                var json = JsonSerializer.Serialize(entity, _jsonOpts);
                var bson = new BsonDocument();
                bson["_id"] = syncId.ToString();
                bson["intId"] = intId;

                using var doc = System.Text.Json.JsonDocument.Parse(json);
                foreach (var prop in doc.RootElement.EnumerateObject())
                {
                    if (prop.Name.Equals("id", StringComparison.OrdinalIgnoreCase))
                        continue; // replaced by intId

                    bson[prop.Name] = JsonElementToBsonValue(prop.Value);
                }

                return bson;
            }
            catch
            {
                return new BsonDocument { ["_id"] = syncId.ToString(), ["intId"] = intId };
            }
        }

        private static BsonValue JsonElementToBsonValue(System.Text.Json.JsonElement el)
        {
            return el.ValueKind switch
            {
                System.Text.Json.JsonValueKind.Null or
                System.Text.Json.JsonValueKind.Undefined => BsonNull.Value,

                System.Text.Json.JsonValueKind.True => (BsonValue)true,
                System.Text.Json.JsonValueKind.False => (BsonValue)false,

                System.Text.Json.JsonValueKind.Number =>
                    el.TryGetInt64(out var l) ? (BsonValue)(long)l :
                    el.TryGetDouble(out var d) ? (BsonValue)(double)d : BsonNull.Value,

                System.Text.Json.JsonValueKind.String =>
                    // Try parse as DateTime for ISO 8601 strings
                    DateTime.TryParse(el.GetString(), System.Globalization.CultureInfo.InvariantCulture,
                        System.Globalization.DateTimeStyles.RoundtripKind, out var dt)
                        ? (BsonValue)dt
                        : (BsonValue)(el.GetString() ?? string.Empty),

                System.Text.Json.JsonValueKind.Array =>
                    new BsonArray(), // skip nested arrays for mirror purposes

                System.Text.Json.JsonValueKind.Object =>
                    new BsonDocument(), // skip nested objects (nav properties)

                _ => BsonNull.Value,
            };
        }

        private async Task QueueOutboxAsync(string operationName, string payloadJson)
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.SyncOutboxEntries.Add(new SyncOutboxEntry
            {
                OperationName = operationName,
                PayloadJson = payloadJson,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,
            });
            await db.SaveChangesAsync();
        }
    }
}
