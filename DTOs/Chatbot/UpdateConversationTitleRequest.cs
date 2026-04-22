using System.ComponentModel.DataAnnotations;

namespace taskflow.DTOs.Chatbot
{
    public class UpdateConversationTitleRequest
    {
        [Required]
        [StringLength(200, MinimumLength = 1)]
        public string Title { get; set; } = string.Empty;
    }
}
