// FILE: Data/Entities/Reminder.cs  PHASE: 2  CHANGE: implements ISyncableEntity — adds SyncId, UpdatedAt, IsSynced
using System;

namespace taskflow.Data.Entities
{
    public class Reminder : ISyncableEntity
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public TaskItem Task { get; set; } = null!;
        public int UserId { get; set; }
        public AppUser User { get; set; } = null!;
        public DateTime FireAt { get; set; }
        public bool NotifyEmail { get; set; }
        public bool NotifyInApp { get; set; }
        public bool HasFired { get; set; } = false;
        public DateTime? FiredAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // ── ISyncableEntity (Phase 2) ─────────────────────────────────────
        public Guid SyncId { get; set; } = Guid.NewGuid();
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool IsSynced { get; set; } = false;
    }
}
