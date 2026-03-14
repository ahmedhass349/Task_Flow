// FILE: DTOs/Settings/ProfileDto.cs
// STATUS: UPDATED
// CHANGES: Added FirstName, LastName fields for frontend compatibility (#24)

namespace taskflow.DTOs.Settings
{
    public class ProfileDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public string? Company { get; set; }
        public string? Country { get; set; }
        public string? Phone { get; set; }
        public string? Timezone { get; set; }
    }
}
