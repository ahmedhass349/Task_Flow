// FILE: Data/Entities/Project.cs  PHASE: 2  CHANGE: implements ISyncableEntity — adds SyncId, UpdatedAt, IsSynced
using System;
using System.Collections.Generic;

namespace taskflow.Data.Entities
{
    public class Project : ISyncableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Color { get; set; }   // hex colour, e.g. "#3B82F6"
        public int OwnerId { get; set; }
        public bool IsStarred { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // ── ISyncableEntity (Phase 2) ─────────────────────────────────────
        public Guid SyncId { get; set; } = Guid.NewGuid();
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool IsSynced { get; set; } = false;

        // Navigation
        public AppUser Owner { get; set; } = null!;
        public ICollection<ProjectMember> Members { get; set; } = new List<ProjectMember>();
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}
