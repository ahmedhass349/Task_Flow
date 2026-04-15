using System;
using System.Collections.Generic;

namespace taskflow.DTOs.GroupChats
{
    public class GroupChatDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int CreatedByUserId { get; set; }
        public string CreatedByName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<GroupChatMemberDto> Members { get; set; } = [];
        public GroupMessageDto? LastMessage { get; set; }
        public int UnreadCount { get; set; }
    }

    public class GroupChatMemberDto
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public DateTime JoinedAt { get; set; }
    }

    public class GroupMessageDto
    {
        public int Id { get; set; }
        public int GroupChatId { get; set; }
        public int SenderId { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public string? SenderAvatarUrl { get; set; }
        public string Body { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
        public string? AttachmentUrl { get; set; }
        public string? AttachmentName { get; set; }
        public string? AttachmentType { get; set; }
        public long? AttachmentSize { get; set; }
    }

    public class CreateGroupChatRequest
    {
        public string Name { get; set; } = string.Empty;
        public List<string> MemberEmails { get; set; } = [];
    }

    public class SendGroupMessageRequest
    {
        public string Body { get; set; } = string.Empty;
        public string? AttachmentUrl { get; set; }
        public string? AttachmentName { get; set; }
        public string? AttachmentType { get; set; }
        public long? AttachmentSize { get; set; }
    }
}
