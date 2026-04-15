using System;

namespace taskflow.Data.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Body { get; set; } = string.Empty;
        public bool IsRead { get; set; } = false;
        public bool IsSystemMessage { get; set; } = false;   // farewell-type system messages
        public bool IsDeletedBySender { get; set; } = false; // soft-delete: hidden from sender
        public bool IsDeletedByReceiver { get; set; } = false; // soft-delete: hidden from receiver
        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        // Attachment support
        public string? AttachmentUrl { get; set; }
        public string? AttachmentName { get; set; }
        public string? AttachmentType { get; set; }  // "image" | "pdf" | "file"
        public long? AttachmentSize { get; set; }    // bytes

        // Navigation
        public AppUser Sender { get; set; } = null!;
        public AppUser Receiver { get; set; } = null!;
    }
}
