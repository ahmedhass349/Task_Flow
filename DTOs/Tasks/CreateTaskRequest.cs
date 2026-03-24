using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using taskflow.Data.Entities;

namespace taskflow.DTOs.Tasks
{
    public class CreateTaskRequest
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public int? ProjectId { get; set; }

        public int? AssigneeId { get; set; }

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
