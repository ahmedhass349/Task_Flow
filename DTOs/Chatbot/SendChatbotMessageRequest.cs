using System.ComponentModel.DataAnnotations;

namespace taskflow.DTOs.Chatbot
{
    public class SendChatbotMessageRequest
    {
        [Required]
        public string Text { get; set; } = string.Empty;
    }
}
