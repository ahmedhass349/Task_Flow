namespace taskflow.DTOs.Dashboard
{
    public class DashboardStatsDto
    {
        public int ActiveTaskCount { get; set; }
        public int InProgressCount { get; set; }
        public int ProjectCount { get; set; }
        public int TeamMemberCount { get; set; }
    }
}
