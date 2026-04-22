using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace taskflow.Models.Mongo
{
    public enum InvitationStatus
    {
        Pending,
        Accepted,
        Declined,
        Cancelled,
        Expired
    }

    public class TeamInvitation
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        // Sender - identified by SQLite user ID (int stored as string) + email
        [BsonElement("SenderUserId")]
        public string SenderUserId { get; set; } = string.Empty;

        [BsonElement("SenderEmail")]
        public string SenderEmail { get; set; } = string.Empty;

        [BsonElement("SenderFullName")]
        public string SenderFullName { get; set; } = string.Empty;

        [BsonElement("SenderAvatarUrl")]
        public string SenderAvatarUrl { get; set; } = string.Empty;

        // Recipient - identified by email (no Username field in AppUser)
        [BsonElement("RecipientEmail")]
        public string RecipientEmail { get; set; } = string.Empty;

        [BsonElement("RecipientFullName")]
        public string RecipientFullName { get; set; } = string.Empty;

        // Team context (references the sender's local SQLite team)
        [BsonElement("TeamId")]
        public string TeamId { get; set; } = string.Empty;

        [BsonElement("TeamName")]
        public string TeamName { get; set; } = string.Empty;

        [BsonElement("Message")]
        public string Message { get; set; } = string.Empty;

        [BsonElement("Role")]
        public string Role { get; set; } = "Member";

        [BsonElement("Status")]
        public InvitationStatus Status { get; set; } = InvitationStatus.Pending;

        [BsonElement("SentAt")]
        [BsonRepresentation(BsonType.DateTime)]
        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        [BsonElement("RespondedAt")]
        [BsonRepresentation(BsonType.DateTime)]
        public DateTime? RespondedAt { get; set; }

        [BsonElement("ExpiresAt")]
        [BsonRepresentation(BsonType.DateTime)]
        public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddDays(30);

        [BsonElement("DeclineReason")]
        public string? DeclineReason { get; set; }
    }
}
