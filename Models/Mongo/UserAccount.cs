using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace taskflow.Models.Mongo
{
    public class UserAccount
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        /// <summary>Email — the primary lookup key for cross-device restoration.</summary>
        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;

        /// <summary>BCrypt hash (embeds salt). Never a plaintext password.</summary>
        [BsonElement("passwordHash")]
        public string PasswordHash { get; set; } = string.Empty;

        /// <summary>
        /// The SQLite integer Id from the device that last wrote this record.
        /// Informational only — used during restoration to verify a match.
        /// </summary>
        [BsonElement("sqliteId")]
        public int SqliteId { get; set; }

        /// <summary>UTC timestamp of the last credential write (register or password reset).</summary>
        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
