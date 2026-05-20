using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace taskflow.Models.Mongo
{
    /// <summary>
    /// Persists a team announcement to MongoDB so the sender can track read receipts.
    /// </summary>
    public class TeamAnnouncement
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("teamId")]
        public string TeamId { get; set; } = string.Empty;

        [BsonElement("teamName")]
        public string TeamName { get; set; } = string.Empty;

        [BsonElement("senderEmail")]
        public string SenderEmail { get; set; } = string.Empty;

        [BsonElement("senderName")]
        public string SenderName { get; set; } = string.Empty;

        [BsonElement("title")]
        public string Title { get; set; } = string.Empty;

        [BsonElement("body")]
        public string Body { get; set; } = string.Empty;

        [BsonElement("sentAt")]
        [BsonRepresentation(BsonType.DateTime)]
        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        [BsonElement("recipients")]
        public List<AnnouncementRecipient> Recipients { get; set; } = new();
    }

    public class AnnouncementRecipient
    {
        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("hasRead")]
        public bool HasRead { get; set; }

        [BsonElement("readAt")]
        [BsonRepresentation(BsonType.DateTime)]
        [BsonIgnoreIfNull]
        public DateTime? ReadAt { get; set; }
    }
}
