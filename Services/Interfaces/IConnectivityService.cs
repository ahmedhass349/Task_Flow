using System;
using System.Threading;
using System.Threading.Tasks;

namespace taskflow.Services.Interfaces
{
    /// <summary>
    /// Tracks MongoDB Atlas reachability and provides a manual offline override.
    /// </summary>
    public interface IConnectivityService
    {
        /// <summary>True when the last MongoDB ping succeeded.</summary>
        bool IsOnline { get; }

        /// <summary>True when the user manually forced offline mode.</summary>
        bool IsManualOffline { get; }

        /// <summary>Effective online state: online AND not manually forced offline.</summary>
        bool IsEffectivelyOnline { get; }

        /// <summary>Number of outbox entries waiting to be synced to MongoDB.</summary>
        int PendingSyncCount { get; }

        /// <summary>When the last automatic connectivity check ran.</summary>
        DateTime LastCheckedAt { get; }

        void SetManualOffline(bool forceOffline);

        /// <summary>Increment the pending-sync counter (called when an outbox entry is added).</summary>
        void IncrementPending();

        /// <summary>Adjust the pending-sync counter by <paramref name="delta"/>.</summary>
        void AdjustPending(int delta);

        /// <summary>
        /// Perform an async MongoDB ping and update <see cref="IsOnline"/>.
        /// Fires <see cref="ConnectivityChanged"/> if the effective state changes.
        /// </summary>
        Task CheckConnectivityAsync(CancellationToken cancellationToken = default);

        /// <summary>Fires whenever <see cref="IsEffectivelyOnline"/> flips.</summary>
        event Action<bool> ConnectivityChanged;
    }
}
