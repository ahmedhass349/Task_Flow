namespace taskflow.DTOs.Settings
{
    public class UpdateProfileRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Company { get; set; }
        public string? Country { get; set; }
        public string? Phone { get; set; }
        public string? Timezone { get; set; }
    }
}
