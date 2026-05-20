using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace taskflow.Models.Mongo
{
    /// <summary>
    /// A pending notification that was written by one user's installation
    /// for a recipient on a different machine.  The recipient's poller picks
    /// this up, delivers it locally via SignalR, then deletes it from MongoDB.
    /// </summary>
    public class CrossNotification
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("recipientEmail")]
        public string RecipientEmail { get; set; } = string.Empty;

        [BsonElement("senderEmail")]
        public string SenderEmail { get; set; } = string.Empty;

        [BsonElement("title")]
        public string Title { get; set; } = string.Empty;

        [BsonElement("message")]
        public string Message { get; set; } = string.Empty;

        /// <summary>Name of the <see cref="taskflow.Data.Entities.NotificationType"/> enum value.</summary>
        [BsonElement("type")]
        public string Type { get; set; } = "General";

        /// <summary>Name of the <see cref="taskflow.Data.Entities.NotificationPriority"/> enum value.</summary>
        [BsonElement("priority")]
        public string Priority { get; set; } = "Medium";

        [BsonElement("actionUrl")]
        public string ActionUrl { get; set; } = string.Empty;

        [BsonElement("createdAt")]
        [BsonRepresentation(BsonType.DateTime)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>Auto-expire after 30 days in case the recipient never comes online.</summary>
        [BsonElement("expiresAt")]
        [BsonRepresentation(BsonType.DateTime)]
        public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddDays(30);

        /// <summary>
        /// Optional JSON payload for structured data (e.g. message body for MessageReceived,
        /// announcementId for SystemAnnouncement read-receipt tracking).
        /// </summary>
        [BsonElement("payload")]
        [BsonIgnoreIfNull]
        public string? Payload { get; set; }
    }
}
