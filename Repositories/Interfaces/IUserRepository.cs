using System.Threading.Tasks;
using taskflow.Data.Entities;

namespace taskflow.Repositories.Interfaces
{
    public interface IUserRepository : IGenericRepository<AppUser>
    {
        Task<AppUser?> GetByEmailAsync(string email);

        /// <summary>
        /// Returns the local <see cref="AppUser"/> for <paramref name="email"/> if it exists,
        /// or creates a minimal "shadow" user (PasswordHash = "__SHADOW__") so that cross-machine
        /// users can be referenced by a local integer ID without a full registration.
        /// </summary>
        Task<AppUser> GetOrCreateShadowUserAsync(string email, string fullName);
    }
}
