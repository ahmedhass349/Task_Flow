using System;
using taskflow.Models.Mongo;

namespace taskflow.DTOs.Mongo
{
    public class InvitationResponseDto
    {
        public string Id { get; set; } = string.Empty;

        public string SenderEmail { get; set; } = string.Empty;
        public string SenderFullName { get; set; } = string.Empty;
        public string SenderAvatarUrl { get; set; } = string.Empty;

        public string RecipientEmail { get; set; } = string.Empty;
        public string RecipientFullName { get; set; } = string.Empty;

        public string TeamId { get; set; } = string.Empty;
        public string TeamName { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;

        public DateTime SentAt { get; set; }
        public DateTime? RespondedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public string? DeclineReason { get; set; }
    }
}
