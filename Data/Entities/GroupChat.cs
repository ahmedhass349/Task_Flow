using System;
using System.Collections.Generic;

namespace taskflow.Data.Entities
{
    public class GroupChat
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int CreatedByUserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public AppUser CreatedBy { get; set; } = null!;
        public ICollection<GroupChatMember> Members { get; set; } = new List<GroupChatMember>();
        public ICollection<GroupMessage> Messages { get; set; } = new List<GroupMessage>();
    }

    public class GroupChatMember
    {
        public int GroupChatId { get; set; }
        public int UserId { get; set; }
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastReadAt { get; set; }

        // Navigation
        public GroupChat GroupChat { get; set; } = null!;
        public AppUser User { get; set; } = null!;
    }

    public class GroupMessage
    {
        public int Id { get; set; }
        public int GroupChatId { get; set; }
        public int SenderId { get; set; }
        public string Body { get; set; } = string.Empty;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        // Attachment support
        public string? AttachmentUrl { get; set; }
        public string? AttachmentName { get; set; }
        public string? AttachmentType { get; set; }
        public long? AttachmentSize { get; set; }

        // Navigation
        public GroupChat GroupChat { get; set; } = null!;
        public AppUser Sender { get; set; } = null!;
    }
}
