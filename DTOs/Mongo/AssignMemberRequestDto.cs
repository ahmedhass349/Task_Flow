namespace taskflow.DTOs.Mongo
{
    public class AssignMemberRequestDto
    {
        public string MemberEmail { get; set; } = string.Empty;
        public string MemberFullName { get; set; } = string.Empty;
    }
}
