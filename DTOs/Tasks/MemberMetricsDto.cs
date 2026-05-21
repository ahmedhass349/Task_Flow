namespace taskflow.DTOs.Tasks
{
    public class MemberMetricsDto
    {
        public int Total { get; set; }
        public int Completed { get; set; }
        public int InProgress { get; set; }
        public int Todo { get; set; }
        public int Review { get; set; }
        public int Overdue { get; set; }
        public int High { get; set; }
        public int Medium { get; set; }
        public int Low { get; set; }
        public int CompletionRatePct { get; set; }
    }
}
