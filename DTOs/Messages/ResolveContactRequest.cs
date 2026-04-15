using System.ComponentModel.DataAnnotations;

namespace taskflow.DTOs.Messages
{
    public class ResolveContactRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
