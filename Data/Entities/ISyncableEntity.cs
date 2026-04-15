// FILE: Data/Entities/ISyncableEntity.cs  PHASE: 2  CHANGE: new interface — marks entities that carry a cross-device SyncId and conflict-resolution timestamp
using System;

namespace taskflow.Data.Entities
{
    /// <summary>
    /// Marks an EF Core entity as cross-device syncable.
    /// <para>
    /// <see cref="SyncId"/> is the stable GUID used as <c>_id</c> in MongoDB so documents
    /// from multiple devices with different SQLite int PKs never collide.
    /// </para>
    /// <para>
    /// <see cref="AppDbContext.SaveChangesAsync"/> automatically stamps <see cref="UpdatedAt"/>
    /// and resets <see cref="IsSynced"/> = false on every modification.
    /// </para>
    /// </summary>
    public interface ISyncableEntity
    {
        /// <summary>Stable cross-device identifier — used as MongoDB <c>_id</c>.</summary>
        Guid SyncId { get; set; }

        /// <summary>UTC timestamp of the last modification — used for conflict resolution.</summary>
        DateTime UpdatedAt { get; set; }

        /// <summary>True once the record has been confirmed written to MongoDB.</summary>
        bool IsSynced { get; set; }
    }
}
