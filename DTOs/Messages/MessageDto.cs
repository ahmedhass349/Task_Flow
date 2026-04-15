using System;

namespace taskflow.DTOs.Messages
{
    public class MessageDto
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public int ReceiverId { get; set; }
        public string Body { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public bool IsSystemMessage { get; set; }
        public DateTime SentAt { get; set; }
        public string? AttachmentUrl { get; set; }
        public string? AttachmentName { get; set; }
        public string? AttachmentType { get; set; }
        public long? AttachmentSize { get; set; }
    }
}
