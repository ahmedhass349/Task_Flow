// FILE: BackgroundServices/CrossNotificationPollerService.cs
// PHASE: 6
// CHANGES: P6-C1 — added SemaphoreSlim(1,1) guard to prevent concurrent poll cycles
//          from delivering the same cross-notifications more than once when a poll
//          takes longer than the 15-second interval.

using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using taskflow.Data;
using taskflow.Data.Entities;
using taskflow.Services;
using taskflow.Services.Interfaces;

namespace taskflow.BackgroundServices
{
    /// <summary>
    /// Runs every 15 seconds and delivers any pending <see cref="taskflow.Models.Mongo.CrossNotification"/>
    /// documents that were written by users on other machines.
    ///
    /// Flow:
    ///   1. Skip the poll if MongoDB is currently unreachable (avoids 8-second timeout storms).
    ///   2. Load every registered user from the local SQLite database.
    ///   3. For each user, call MongoDB to atomically fetch-and-delete any pending cross-notifications
    ///      addressed to that user's e-mail address.
    ///   4. Deliver each notification locally via <see cref="INotificationService.CreateAsync"/>,
    ///      which persists it to SQLite and fires a real-time SignalR push.
    /// </summary>
    public class CrossNotificationPollerService : BackgroundService
    {
        // FILE: BackgroundServices/CrossNotificationPollerService.cs  PHASE: 3  CHANGE: reduced interval from 30s to 15s for faster invitation response UX
        private static readonly TimeSpan _interval = TimeSpan.FromSeconds(15);

        // P6-C1: prevents concurrent polls if a cycle takes longer than the interval.
        private readonly SemaphoreSlim _pollLock = new(1, 1);

        private readonly IServiceProvider _serviceProvider;
        private readonly IConnectivityService _connectivityService;
        private readonly ILogger<CrossNotificationPollerService> _logger;

        public CrossNotificationPollerService(
            IServiceProvider serviceProvider,
            IConnectivityService connectivityService,
            ILogger<CrossNotificationPollerService> logger)
        {
            _serviceProvider = serviceProvider;
            _connectivityService = connectivityService;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("CrossNotificationPollerService started (interval={Interval}s).", _interval.TotalSeconds);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // P3-A: Skip poll entirely when MongoDB is offline — avoids 8-second timeout
                    // storms that would fire every 15 seconds during a connectivity outage.
                    // P6-C1: TryEnter (non-blocking) ensures only one cycle runs at a time.
                    if (_connectivityService.IsEffectivelyOnline && await _pollLock.WaitAsync(0, stoppingToken))
                    {
                        try   { await PollAsync(stoppingToken); }
                        finally { _pollLock.Release(); }
                    }
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "CrossNotificationPollerService: unhandled error during poll cycle.");
                }

                await Task.Delay(_interval, stoppingToken);
            }

            _logger.LogInformation("CrossNotificationPollerService stopped.");
        }

        private async Task PollAsync(CancellationToken ct)
        {
            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
            var mongoService = scope.ServiceProvider.GetRequiredService<IMongoService>();

            // Load all local user IDs + emails from SQLite
            var users = await db.AppUsers
                .AsNoTracking()
                .Select(u => new { u.Id, u.Email })
                .ToListAsync(ct);

            foreach (var user in users)
            {
                ct.ThrowIfCancellationRequested();

                try
                {
                    var pending = await mongoService.PullAndDeleteCrossNotificationsAsync(user.Email);
                    if (pending.Count == 0) continue;

                    _logger.LogDebug("CrossNotificationPollerService: delivering {Count} cross-notification(s) for {Email}.",
                        pending.Count, user.Email);

                    foreach (var n in pending)
                    {
                        try
                        {
                            var type = Enum.TryParse<NotificationType>(n.Type, out var t)
                                ? t
                                : NotificationType.SystemAnnouncement;

                            var priority = Enum.TryParse<NotificationPriority>(n.Priority, out var p)
                                ? p
                                : NotificationPriority.Medium;

                            await notificationService.CreateAsync(
                                user.Id,
                                n.Title,
                                n.Message,
                                type,
                                priority,
                                actionUrl: string.IsNullOrEmpty(n.ActionUrl) ? null : n.ActionUrl
                            );
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning(ex,
                                "CrossNotificationPollerService: failed to deliver notification id={Id} for user {UserId}.",
                                n.Id, user.Id);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex,
                        "CrossNotificationPollerService: error pulling cross-notifications for {Email}.", user.Email);
                }
            }
        }
    }
}
