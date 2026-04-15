using System.ComponentModel.DataAnnotations;

namespace taskflow.DTOs.Messages
{
    public class SendMessageRequest
    {
        [Required]
        public int ReceiverId { get; set; }

        // Body is optional when sending a pure attachment message
        public string Body { get; set; } = string.Empty;

        public string? AttachmentUrl { get; set; }
        public string? AttachmentName { get; set; }
        public string? AttachmentType { get; set; }
        public long? AttachmentSize { get; set; }
    }
}
