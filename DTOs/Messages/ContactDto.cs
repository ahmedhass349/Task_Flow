using System;

namespace taskflow.DTOs.Messages
{
    public class ContactDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Initials { get; set; } = string.Empty;       // Computed: e.g. "JD" for "John Doe" (#29)
        public string? AvatarUrl { get; set; }
        public string LastMessage { get; set; } = string.Empty;
        public DateTime LastMessageTime { get; set; }
        public int UnreadCount { get; set; }
        public bool IsStarred { get; set; }                        // For frontend compatibility (#29)
        // A-02: last presence heartbeat from MongoDB user_presence; null when user has no presence record
        public DateTime? LastSeen { get; set; }
    }
}
