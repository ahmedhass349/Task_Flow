// FILE: DTOs/Tasks/TaskDto.cs
// PHASE: 4
// CHANGES: Added IsAssignedByOther flag so frontend can split "My Tasks" vs "Assigned to Me"

using System;

namespace taskflow.DTOs.Tasks
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public string? AssigneeName { get; set; }
        public DateTime? DueDate { get; set; }
        public string? DueDateLabel { get; set; }   // Formatted string e.g. "Oct 15" for frontend (#28)
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public bool IsStarred { get; set; }
        /// <summary>True when this task was created by someone other than the assignee (i.e., leader-assigned). Phase 4.</summary>
        public bool IsAssignedByOther { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
