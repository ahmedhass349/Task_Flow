using System;

namespace taskflow.Data.Entities
{
    /// <summary>
    /// Local SQLite mirror of a MongoDB team_members document.
    /// Populated on every successful online read; read back when offline.
    /// </summary>
    public class LocalTeamMember
    {
        public int Id { get; set; }

        /// <summary>The MongoDB _id (ObjectId as string).</summary>
        public string MongoId { get; set; } = string.Empty;

        public string TeamId { get; set; } = string.Empty;
        public string TeamName { get; set; } = string.Empty;
        public string OwnerEmail { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string UserFullName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public string Role { get; set; } = "Member";
        public bool IsActive { get; set; } = true;
        public DateTime JoinedAt { get; set; }

        /// <summary>When this row was last synced from MongoDB.</summary>
        public DateTime CachedAt { get; set; } = DateTime.UtcNow;
    }
}
