/*
  FILE: Data/Entities/CalendarEvent.cs
  PHASE: 2
  MISSION: 1-CrossMachine
  CHANGES:
    - Implemented ISyncableEntity (adds SyncId, UpdatedAt, IsSynced) so CalendarEvent
      participates in the MirrorService/outbox sync pipeline (P2.3).
    - Added OwnerEmail (string?) — stable cross-device key for MongoDB pull queries (P2.3).
    - Mirror and EraseSync in CalendarService now use SyncId as MongoDB _id.
*/
using System;

namespace taskflow.Data.Entities
{
    public class CalendarEvent : ISyncableEntity
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }
        /// <summary>Email of the owner — stable cross-device key used in MongoDB pull queries.</summary>
        public string? OwnerEmail { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
        public string? Color { get; set; }   // hex colour for the event block
        public string? MeetingLink { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // ── ISyncableEntity (Phase 2) ─────────────────────────────────────
        public Guid SyncId { get; set; } = Guid.NewGuid();
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool IsSynced { get; set; } = false;

        // Navigation
        public AppUser Owner { get; set; } = null!;
    }
}
