using System.ComponentModel.DataAnnotations;

namespace taskflow.DTOs.Chatbot
{
    public class CreateConversationRequest
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
    }
}
