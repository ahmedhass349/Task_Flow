namespace taskflow.DTOs.Auth
{
    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; } = null!;
        /// <summary>True when the login succeeded via cloud-backup restoration (first login after reinstall).</summary>
        public bool IsRestored { get; set; }
    }
}
