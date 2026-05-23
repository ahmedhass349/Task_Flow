// FILE: DTOs/Teams/TeamMemberDto.cs  PHASE: 5  CHANGES: Added TasksTodo + TasksOverdue for progress dashboard

namespace taskflow.DTOs.Teams
{
    public class TeamMemberDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Initials { get; set; } = string.Empty;       // Computed: e.g. "JD" for "John Doe"
        public string Email { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public string Role { get; set; } = string.Empty;
        public int TasksCompleted { get; set; }
        public int TasksInProgress { get; set; }
        /// <summary>Phase 5: tasks with status Todo assigned to this member</summary>
        public int TasksTodo { get; set; }
        /// <summary>Phase 5: tasks with status Overdue assigned to this member</summary>
        public int TasksOverdue { get; set; }
    }
}
