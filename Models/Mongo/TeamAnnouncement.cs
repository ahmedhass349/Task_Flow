// FILE: Models/Mongo/TeamAnnouncement.cs  PHASE: 2  CHANGES: New persistent announcement model (MongoDB)
using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace taskflow.Models.Mongo
{
    /// <summary>
    /// A team-wide announcement persisted in MongoDB so every machine can read it.
    /// ReadBy tracks which member emails have acknowledged the announcement.
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
        public string Title { get; set; } = "Team Announcement";

        [BsonElement("message")]
        public string Message { get; set; } = string.Empty;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>Lowercase emails of members who have read this announcement.</summary>
        [BsonElement("readBy")]
        public List<string> ReadBy { get; set; } = new();
    }
}
