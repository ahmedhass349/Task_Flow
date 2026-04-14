using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using taskflow.Services.Interfaces;

namespace taskflow.Services
{
    /// <summary>
    /// Singleton that tracks whether MongoDB Atlas is reachable.
    /// The actual periodic ping is driven by <c>OfflineSyncService</c> (a hosted service),
    /// so this class only exposes state + a single async check method.
    /// </summary>
    public class ConnectivityService : IConnectivityService
    {
        private readonly MongoService _mongoService;
        private readonly ILogger<ConnectivityService> _logger;

        private volatile bool _isOnline = false;
        private volatile bool _isManualOffline = false;
        private int _pendingSyncCount = 0;
        private DateTime _lastCheckedAt = DateTime.MinValue;

        // Tracks the "effective" state so we only fire the event on actual changes.
        private volatile bool _lastEffective = false;

        public event Action<bool>? ConnectivityChanged;

        public bool IsOnline => _isOnline;
        public bool IsManualOffline => _isManualOffline;
        public bool IsEffectivelyOnline => _isOnline && !_isManualOffline;
        public int PendingSyncCount => _pendingSyncCount;
        public DateTime LastCheckedAt => _lastCheckedAt;

        public ConnectivityService(MongoService mongoService, ILogger<ConnectivityService> logger)
        {
            _mongoService = mongoService;
            _logger = logger;
        }

        public void SetManualOffline(bool forceOffline)
        {
            bool wasEffective = IsEffectivelyOnline;
            _isManualOffline = forceOffline;
            _logger.LogInformation("Connectivity: manual offline = {Value}", forceOffline);
            NotifyIfChanged(wasEffective);
        }

        public void IncrementPending()
        {
            Interlocked.Increment(ref _pendingSyncCount);
        }

        public void AdjustPending(int delta)
        {
            Interlocked.Add(ref _pendingSyncCount, delta);
        }

        public async Task CheckConnectivityAsync(CancellationToken cancellationToken = default)
        {
            bool wasEffective = IsEffectivelyOnline;
            bool ping = await _mongoService.PingAsync(cancellationToken);
            _isOnline = ping;
            _lastCheckedAt = DateTime.UtcNow;

            if (ping)
                _logger.LogDebug("Connectivity: MongoDB ping succeeded.");
            else
                _logger.LogDebug("Connectivity: MongoDB ping failed — marking offline.");

            NotifyIfChanged(wasEffective);
        }

        private void NotifyIfChanged(bool wasEffective)
        {
            bool isNowEffective = IsEffectivelyOnline;
            if (wasEffective != isNowEffective)
            {
                _logger.LogInformation("Connectivity: effective state changed → {State}",
                    isNowEffective ? "ONLINE" : "OFFLINE");
                _lastEffective = isNowEffective;
                ConnectivityChanged?.Invoke(isNowEffective);
            }
        }
    }
}
