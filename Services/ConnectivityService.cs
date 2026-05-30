/*
  FILE: Services/ConnectivityService.cs
  PHASE: 1
  DEFECT: 2-Connection
  CHANGES:
    - Added _consecutiveFailures int counter and OfflineFailureThreshold = 2 constant.
      A single ping failure no longer immediately declares the app offline.
      Only after two consecutive ping failures is _isOnline set to false.
      This prevents transient network blips (prevalent on Machine B's slower connection)
      from triggering the perpetual connect/disconnect flip-flop.
    - On ping success _consecutiveFailures resets to 0 and _isOnline is set true immediately.
*/
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

        // DEFECT 2 FIX: require this many consecutive ping failures before declaring offline.
        // One dropped ping on a slow connection (Machine B) must not flip the UI to offline.
        private int _consecutiveFailures = 0;
        private const int OfflineFailureThreshold = 3;

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
            _lastCheckedAt = DateTime.UtcNow;

            if (ping)
            {
                _consecutiveFailures = 0;
                _isOnline = true;
                _logger.LogDebug("Connectivity: MongoDB ping succeeded.");
            }
            else
            {
                _consecutiveFailures++;
                if (_consecutiveFailures >= OfflineFailureThreshold)
                {
                    _isOnline = false;
                    _logger.LogDebug(
                        "Connectivity: MongoDB ping failed {N} consecutive time(s) — marking offline.",
                        _consecutiveFailures);
                }
                else
                {
                    _logger.LogDebug(
                        "Connectivity: MongoDB ping failed ({N}/{Threshold}) — not yet offline.",
                        _consecutiveFailures, OfflineFailureThreshold);
                }
            }

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
