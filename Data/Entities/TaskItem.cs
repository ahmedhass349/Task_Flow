// FILE: Data/Entities/TaskItem.cs  PHASE: 2  CHANGE: implements ISyncableEntity — adds SyncId, UpdatedAt, IsSynced, LastModifiedBy
using System;
using System.Collections.Generic;

namespace taskflow.Data.Entities
{
    public enum TaskPriority { Low, Medium, High }
    public enum TaskStatus
    {
        Todo = 0,
        InProgress = 1,
        Review = 2,
        Completed = 3,
        Overdue = 4
    }

    public class TaskItem : ISyncableEntity
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? ProjectId { get; set; }
        public int? AssigneeId { get; set; }
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        public TaskStatus Status { get; set; } = TaskStatus.Todo;
        public DateTime? DueDate { get; set; }
        public bool IsStarred { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // ── ISyncableEntity (Phase 2) ─────────────────────────────────────
        public Guid SyncId { get; set; } = Guid.NewGuid();
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool IsSynced { get; set; } = false;
        /// <summary>Email of the user who last modified this task (denormalised for MongoDB queries).</summary>
        public string? LastModifiedBy { get; set; }

        // Navigation
        public Project? Project { get; set; }
        public AppUser? Assignee { get; set; }
        public ICollection<TaskComment> Comments { get; set; } = new List<TaskComment>();
    }
}
