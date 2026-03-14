using taskflow.Data.Entities;

namespace taskflow.DTOs.Tasks
{
    public class TaskFilterRequest
    {
        public TaskStatus? Status { get; set; }
        public TaskPriority? Priority { get; set; }
        public int? ProjectId { get; set; }
        public bool? IsStarred { get; set; }
        public string? Search { get; set; }
    }
}
