// FILE: Services/Interfaces/IUserDataSyncService.cs  PHASE: 2  CHANGE: new interface for per-user MongoDB pull-down
using System.Threading;
using System.Threading.Tasks;

namespace taskflow.Services.Interfaces
{
    /// <summary>
    /// Pulls a user's data from MongoDB into the local SQLite database.
    /// Called fire-and-forget after login so the user's tasks/projects created on other
    /// devices are available immediately without waiting for BulkSyncStartupService.
    /// MongoDB failures are silently logged and never propagate.
    /// </summary>
    public interface IUserDataSyncService
    {
        Task PullForUserAsync(int userId, CancellationToken ct = default);
    }
}
