/*
  FILE: Data/Entities/GroupChat.cs
  PHASE: 2
  MISSION: 1-CrossMachine
  CHANGES:
    - Added XML doc comments (P2.4): documents intentional SQLite-local-only status for
      GroupChat, GroupChatMember, and GroupMessage classes.
*/
using System;
using System.Collections.Generic;

namespace taskflow.Data.Entities
{
    /// <summary>
    /// A named group chat room shared among multiple users.
    /// <para>
    /// <b>Sync status: intentionally SQLite-local-only.</b>
    /// Group chat data (rooms, members, and messages) is stored only in the local SQLite
    /// database and is NOT synced to MongoDB. A group chat created on Machine A will not
    /// be visible on Machine B. When cross-device sync is required, implement
    /// <c>ISyncableEntity</c> and add MongoDB mirror collections for all three entities,
    /// following the same pattern used by <c>TaskItem</c> and <c>Notification</c>.
    /// </para>
    /// </summary>
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
