using System;

namespace taskflow.DTOs.Chatbot
{
    public class ChatbotMessageDto
    {
        public int Id { get; set; }
        public string Role { get; set; } = string.Empty;   // "user" or "assistant"
        public string Text { get; set; } = string.Empty;
        public bool IsEdited { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
