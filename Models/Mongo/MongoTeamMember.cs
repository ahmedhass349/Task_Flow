using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace taskflow.Models.Mongo
{
    /// <summary>
    /// Cross-device team membership record stored on the shared MongoDB relay.
    /// Named MongoTeamMember to avoid conflict with the SQLite TeamMember entity.
    /// TeamId references the owner's local SQLite team ID (stored as string).
    /// </summary>
    public class MongoTeamMember
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        // References the sender/owner's local SQLite team ID
        public string TeamId { get; set; } = string.Empty;
        public string TeamName { get; set; } = string.Empty;

        // Email identifies the member (no Username in AppUser)
        public string UserEmail { get; set; } = string.Empty;
        public string UserFullName { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;

        public string Role { get; set; } = "Member";

        // Email of the team owner who sent the invitation
        public string OwnerEmail { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.DateTime)]
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;
    }
}
