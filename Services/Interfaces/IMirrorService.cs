namespace taskflow.Services.Interfaces
{
    /// <summary>
    /// Provides fire-and-forget MongoDB mirroring for all SQLite entities.
    /// When online, the document is immediately upserted/deleted in MongoDB.
    /// When offline, the operation is queued in the outbox for replay on reconnect.
    /// </summary>
    public interface IMirrorService
    {
        /// <summary>Upsert the entity into the named MongoDB collection using its SQLite int id.</summary>
        void Mirror<T>(string collection, int id, T entity) where T : class;

        /// <summary>Delete the document with the given SQLite int id from the named MongoDB collection.</summary>
        void Erase(string collection, int id);
    }
}
