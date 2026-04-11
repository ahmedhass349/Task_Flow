using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace taskflow.Models.Mongo
{
    /// <summary>
    /// Represents a user's discoverable presence on the shared MongoDB relay.
    /// Email is the global unique identifier because AppUser has no Username field.
    /// </summary>
    public class UserPresence
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        // Unique identity key — email is unique in AppUser (HasIndex(e => e.Email).IsUnique())
        public string Email { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.DateTime)]
        public DateTime LastSeen { get; set; } = DateTime.UtcNow;

        [BsonRepresentation(BsonType.DateTime)]
        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;

        public bool AcceptsInvitations { get; set; } = true;
    }
}
