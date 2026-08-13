/*
  FILE: Data/Entities/Notification.cs
  PHASE: 2
  MISSION: 1-CrossMachine
  CHANGES:
    - Added UserEmail (string?) — stable cross-device identifier for MongoDB pull queries (P2.2).
*/
using System;

namespace taskflow.Data.Entities
{
    public enum NotificationType
    {
        TaskCreated,
        TaskUpdated,
        TaskDeleted,
        TaskDueSoon,
        TaskOverdue,
        TaskCompleted,
        ReminderFired,
        AccountWelcome,
        AccountProfileUpdated,
        SystemAnnouncement,
        TeamInvitationReceived,
        TeamInvitationAccepted,
        TeamInvitationDeclined,
        TeamDeleted,
        TeamMemberRemoved,
        TeamMemberLeft,
        MessageReceived
    }

    public enum NotificationPriority
    {
        Low,
        Medium,
        High,
        Critical
    }

    public class Notification : ISyncableEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        /// <summary>Email of the recipient — stable cross-device key used in MongoDB pull queries.</summary>
        public string? UserEmail { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public NotificationType Type { get; set; }
        public NotificationPriority Priority { get; set; }
        public bool IsRead { get; set; } = false;
        public string? ActionUrl { get; set; }
        public int? RelatedTaskId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReadAt { get; set; }

        // ── ISyncableEntity (Phase 2) ─────────────────────────────────────
        public Guid SyncId { get; set; } = Guid.NewGuid();
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool IsSynced { get; set; } = false;

        // Navigation
        public AppUser User { get; set; } = null!;
        public TaskItem? RelatedTask { get; set; }
    }
}
