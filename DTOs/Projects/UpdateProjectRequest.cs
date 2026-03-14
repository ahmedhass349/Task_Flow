using System.ComponentModel.DataAnnotations;

namespace taskflow.DTOs.Projects
{
    public class UpdateProjectRequest
    {
        [Required]
        [StringLength(150)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
        public string? Color { get; set; }
    }
}
