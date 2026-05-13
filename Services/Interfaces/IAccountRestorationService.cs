// FILE: Services/Interfaces/IAccountRestorationService.cs
// PURPOSE: Contract for restoring an account from MongoDB credentials after reinstall.

using System.Threading.Tasks;
using taskflow.Data.Entities;

namespace taskflow.Services.Interfaces
{
    public interface IAccountRestorationService
    {
        /// <summary>
        /// Attempts to restore an account into the local SQLite database by:
        /// 1. Looking up credentials in MongoDB <c>user_accounts</c> collection.
        /// 2. Verifying the supplied password against the stored BCrypt hash.
        /// 3. If valid: recreating the <see cref="AppUser"/> row in SQLite so subsequent
        ///    login calls succeed on the local path.
        /// </summary>
        /// <returns>
        /// The restored <see cref="AppUser"/> when successful.
        /// <c>null</c> when no backup exists in MongoDB (e.g. offline or account never backed up).
        /// </returns>
        /// <exception cref="System.UnauthorizedAccessException">
        /// Thrown when a backup is found but the supplied password does not match.
        /// </exception>
        Task<AppUser?> TryRestoreAsync(string email, string plaintextPassword);
    }
}
