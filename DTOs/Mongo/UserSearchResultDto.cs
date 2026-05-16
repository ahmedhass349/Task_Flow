using System;

namespace taskflow.DTOs.Mongo
{
    public class UserSearchResultDto
    {
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public DateTime? LastSeen { get; set; }
        public bool AcceptsInvitations { get; set; }
    }
}
