using System;

namespace taskflow.Data.Entities
{
    /// <summary>
    /// Local SQLite mirror of a MongoDB team_invitations document.
    /// Populated on every successful online read; read back when offline.
    /// </summary>
    public class LocalInvitation
    {
        public int Id { get; set; }

        /// <summary>The MongoDB _id (ObjectId as string). "offline_xxx" for optimistic offline records.</summary>
        public string MongoId { get; set; } = string.Empty;

        public string SenderEmail { get; set; } = string.Empty;
        public string SenderFullName { get; set; } = string.Empty;
        public string SenderAvatarUrl { get; set; } = string.Empty;
        public string RecipientEmail { get; set; } = string.Empty;
        public string RecipientFullName { get; set; } = string.Empty;
        public string? TeamId { get; set; }
        public string? TeamName { get; set; }
        public string Role { get; set; } = "Member";
        public string? Message { get; set; }

        /// <summary>Pending | Accepted | Declined | Cancelled | Expired</summary>
        public string Status { get; set; } = "Pending";

        public DateTime SentAt { get; set; }
        public DateTime? RespondedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public string? DeclineReason { get; set; }

        /// <summary>When this row was last synced from MongoDB.</summary>
        public DateTime CachedAt { get; set; } = DateTime.UtcNow;
    }
}
