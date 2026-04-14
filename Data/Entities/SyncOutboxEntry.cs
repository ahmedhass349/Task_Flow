using System;

namespace taskflow.Data.Entities
{
    /// <summary>
    /// Queues MongoDB write operations that could not be executed while offline,
    /// so they can be replayed once the connection is restored.
    /// </summary>
    public class SyncOutboxEntry
    {
        public int Id { get; set; }

        /// <summary>Unique idempotency key — prevents double-replay.</summary>
        public string OperationId { get; set; } = Guid.NewGuid().ToString("N");

        /// <summary>
        /// Name of the MongoService method to replay, e.g. "SendInvitation".
        /// </summary>
        public string OperationName { get; set; } = string.Empty;

        /// <summary>JSON-serialized operation arguments.</summary>
        public string PayloadJson { get; set; } = string.Empty;

        /// <summary>Pending | Processing | Synced | Failed</summary>
        public string Status { get; set; } = "Pending";

        public int Attempts { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastAttemptAt { get; set; }

        public string? ErrorMessage { get; set; }
    }
}
