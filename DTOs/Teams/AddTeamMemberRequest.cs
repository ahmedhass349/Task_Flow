using System.ComponentModel.DataAnnotations;
using taskflow.Data.Entities;

namespace taskflow.DTOs.Teams
{
    public class AddTeamMemberRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public TeamRole Role { get; set; } = TeamRole.Member;
    }
}
