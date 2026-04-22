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
        [BsonElement("TeamId")]
        public string TeamId { get; set; } = string.Empty;

        [BsonElement("TeamName")]
        public string TeamName { get; set; } = string.Empty;

        // Email identifies the member (no Username in AppUser)
        [BsonElement("UserEmail")]
        public string UserEmail { get; set; } = string.Empty;

        [BsonElement("UserFullName")]
        public string UserFullName { get; set; } = string.Empty;

        [BsonElement("AvatarUrl")]
        public string AvatarUrl { get; set; } = string.Empty;

        [BsonElement("Role")]
        public string Role { get; set; } = "Member";

        // Email of the team owner who sent the invitation
        [BsonElement("OwnerEmail")]
        public string OwnerEmail { get; set; } = string.Empty;

        [BsonElement("JoinedAt")]
        [BsonRepresentation(BsonType.DateTime)]
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("IsActive")]
        public bool IsActive { get; set; } = true;
    }
}
