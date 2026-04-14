using System;
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

        // ── Internals ────────────────────────────────────────────────────────

        private async Task MirrorAsync<T>(string collection, int id, T entity) where T : class
        {
            try
            {
                if (_connectivity.IsEffectivelyOnline)
                {
                    var doc = ToSafeBsonDocument(entity, id);
                    await _mongo.UpsertDocumentAsync(collection, id, doc);
                }
                else
                {
                    // Serialize entity via System.Text.Json (ignores cycles/nulls)
                    var entityJson = JsonSerializer.Serialize(entity, _jsonOpts);
                    // Store as extended-JSON round-trip by building the BsonDocument first
                    var doc = ToSafeBsonDocument(entity, id);
                    var extJson = doc.ToJson();

                    await QueueOutboxAsync("MirrorUpsert", JsonSerializer.Serialize(new
                    {
                        collection,
                        id,
                        extJson,
                    }));

                    _connectivity.IncrementPending();
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "MirrorService.MirrorAsync failed: col={Col} id={Id}", collection, id);
            }
        }

        private async Task EraseAsync(string collection, int id)
        {
            try
            {
                if (_connectivity.IsEffectivelyOnline)
                {
                    await _mongo.DeleteDocumentAsync(collection, id);
                }
                else
                {
                    await QueueOutboxAsync("MirrorDelete", JsonSerializer.Serialize(new { collection, id }));
                    _connectivity.IncrementPending();
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "MirrorService.EraseAsync failed: col={Col} id={Id}", collection, id);
            }
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
