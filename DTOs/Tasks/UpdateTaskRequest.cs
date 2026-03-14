using System;
using System.ComponentModel.DataAnnotations;
using taskflow.Data.Entities;

namespace taskflow.DTOs.Tasks
{
    public class UpdateTaskRequest
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }
        public int? AssigneeId { get; set; }

        [Required]
        public TaskPriority Priority { get; set; }

        [Required]
        public TaskStatus Status { get; set; }

        public DateTime? DueDate { get; set; }
    }
}
