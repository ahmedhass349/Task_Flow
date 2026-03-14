using System.ComponentModel.DataAnnotations;

namespace taskflow.DTOs.Teams
{
    public class CreateTeamRequest
    {
        [Required]
        [StringLength(150)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
    }
}
