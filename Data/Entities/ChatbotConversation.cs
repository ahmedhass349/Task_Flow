/*
  FILE: Data/Entities/ChatbotConversation.cs
  PHASE: 2
  MISSION: 1-CrossMachine
  CHANGES:
    - Added XML doc comments (P2.4): documents intentional SQLite-local-only status for
      ChatbotConversation and ChatbotMessage classes.
*/
using System;
using System.Collections.Generic;

namespace taskflow.Data.Entities
{
    /// <summary>
    /// A conversation thread between a user and the in-app AI chatbot.
    /// <para>
    /// <b>Sync status: intentionally SQLite-local-only.</b>
    /// Chatbot conversations and their messages are stored only in the local SQLite database
    /// and are NOT synced to MongoDB. Conversation history on Machine A will not appear on
    /// Machine B. This is a deliberate design choice: chatbot history is treated as a
    /// local ephemeral aid, not persistent user data. If cross-device history is required
    /// in the future, implement <c>ISyncableEntity</c> on both classes and add MongoDB
    /// mirror collections, following the same pattern used by <c>Notification</c>.
    /// </para>
    /// </summary>
    public class ChatbotConversation
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public AppUser User { get; set; } = null!;
        public ICollection<ChatbotMessage> Messages { get; set; } = new List<ChatbotMessage>();
    }
}
