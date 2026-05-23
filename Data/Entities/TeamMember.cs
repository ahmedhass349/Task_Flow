// FILE: Data/Entities/TeamMember.cs  PHASE: 1  CHANGES: Renamed TeamRole.Admin → TeamRole.Leader
namespace taskflow.Data.Entities
{
    public enum TeamRole { Member, Leader }

    public class TeamMember
    {
        public int TeamId { get; set; }
        public int UserId { get; set; }
        public TeamRole Role { get; set; } = TeamRole.Member;

        // Navigation
        public Team Team { get; set; } = null!;
        public AppUser User { get; set; } = null!;
    }
}
