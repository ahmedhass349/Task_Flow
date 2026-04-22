using System;

namespace taskflow.DTOs.Chatbot
{
    public class ConversationListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }
        public int MessageCount { get; set; }
        public string? LastMessagePreview { get; set; }
    }
}
