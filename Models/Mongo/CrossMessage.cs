using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace taskflow.Models.Mongo
{
    /// <summary>
    /// A direct message queued in MongoDB for delivery to a user on a different machine.
    /// The recipient's <see cref="BackgroundServices.CrossMessagePollerService"/> picks it up
    /// within ~30 seconds, creates the local <c>Message</c> record, then deletes this document.
    /// </summary>
    public class CrossMessage
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [BsonElement("senderEmail")]
        public string SenderEmail { get; set; } = string.Empty;

        [BsonElement("senderName")]
        public string SenderName { get; set; } = string.Empty;

        [BsonElement("recipientEmail")]
        public string RecipientEmail { get; set; } = string.Empty;

        [BsonElement("body")]
        public string Body { get; set; } = string.Empty;

        [BsonElement("sentAt")]
        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        [BsonElement("attachmentUrl")]
        public string? AttachmentUrl { get; set; }

        [BsonElement("attachmentName")]
        public string? AttachmentName { get; set; }

        [BsonElement("attachmentType")]
        public string? AttachmentType { get; set; }

        [BsonElement("attachmentSize")]
        public long? AttachmentSize { get; set; }

        /// <summary>MongoDB TTL — document auto-deleted after 90 days if not picked up.</summary>
        [BsonElement("expiresAt")]
        public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddDays(90);
    }
}
