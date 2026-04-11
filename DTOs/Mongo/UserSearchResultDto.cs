namespace taskflow.DTOs.Mongo
{
    public class UserSearchResultDto
    {
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public bool AcceptsInvitations { get; set; }
    }
}
