// FILE: Services/Interfaces/IMirrorService.cs  PHASE: 2  CHANGE: added EraseSync for SyncId-keyed deletion
using System;

namespace taskflow.Services.Interfaces
{
    /// <summary>
    /// Provides fire-and-forget MongoDB mirroring for all SQLite entities.
    /// When online, the document is immediately upserted/deleted in MongoDB.
    /// When offline, the operation is queued in the outbox for replay on reconnect.
    /// </summary>
    public interface IMirrorService
    {
        /// <summary>Upsert the entity into the named MongoDB collection.
        /// If <typeparamref name="T"/> implements <see cref="taskflow.Data.Entities.ISyncableEntity"/>,
        /// the document <c>_id</c> will be the entity's SyncId (GUID string); otherwise the SQLite int id.</summary>
        void Mirror<T>(string collection, int id, T entity) where T : class;

        /// <summary>Delete the document with the given SQLite int id from the named MongoDB collection.
        /// For entities without a SyncId.</summary>
        void Erase(string collection, int id);

        /// <summary>Delete the document whose MongoDB <c>_id</c> equals the GUID SyncId.
        /// Use this for entities that implement ISyncableEntity.</summary>
        void EraseSync(string collection, Guid syncId);
    }
}
