using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using taskflow.Data.Entities;

namespace taskflow.DTOs.Tasks
{
    public class AssignTaskRequest
    {
        /// <summary>Email of the team member to assign the task to.</summary>
        [Required]
        [EmailAddress]
        public string AssigneeEmail { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public int? ProjectId { get; set; }

        [Required]
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;

        [Required]
        public TaskStatus Status { get; set; } = TaskStatus.Todo;

        public DateTime? DueDate { get; set; }

        public Dictionary<string, List<string>>? ReminderMap { get; set; }

        public bool NotifyEmail { get; set; } = true;

        public bool NotifyInApp { get; set; } = true;
    }
}
