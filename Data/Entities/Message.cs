/*
  FILE: Data/Entities/Message.cs
  PHASE: 2
  MISSION: 1-CrossMachine
  CHANGES:
    - Added XML doc comment (P2.4): documents intentional SQLite-local-only status.
      Cross-device sync was planned (see Models/Mongo/CrossMessage.cs) but deferred.
*/
using System;

namespace taskflow.Data.Entities
{
    /// <summary>
    /// Direct message between two users.
    /// <para>
    /// <b>Sync status: intentionally SQLite-local-only.</b>
    /// Direct messages are stored only in the local SQLite database and are NOT synced to
    /// MongoDB. A cross-device sync schema was prototyped in <c>Models/Mongo/CrossMessage.cs</c>
    /// but has not been implemented. Messages sent on Machine A will not appear on Machine B.
    /// When cross-device message sync is required, implement <c>ISyncableEntity</c> on this
    /// entity and add a MongoDB mirror collection, following the same pattern used by
    /// <c>TaskItem</c>, <c>Project</c>, and <c>Notification</c>.
    /// </para>
    /// </summary>
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
