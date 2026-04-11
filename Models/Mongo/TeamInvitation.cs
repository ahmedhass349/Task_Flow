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
        public string SenderUserId { get; set; } = string.Empty;
        public string SenderEmail { get; set; } = string.Empty;
        public string SenderFullName { get; set; } = string.Empty;
        public string SenderAvatarUrl { get; set; } = string.Empty;

        // Recipient - identified by email (no Username field in AppUser)
        public string RecipientEmail { get; set; } = string.Empty;
        public string RecipientFullName { get; set; } = string.Empty;

        // Team context (references the sender's local SQLite team)
        public string TeamId { get; set; } = string.Empty;
        public string TeamName { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;
        public string Role { get; set; } = "Member";

        public InvitationStatus Status { get; set; } = InvitationStatus.Pending;

        [BsonRepresentation(BsonType.DateTime)]
        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        [BsonRepresentation(BsonType.DateTime)]
        public DateTime? RespondedAt { get; set; }

        [BsonRepresentation(BsonType.DateTime)]
        public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddDays(30);

        public string? DeclineReason { get; set; }
    }
}
