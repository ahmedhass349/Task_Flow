using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using taskflow.Data;
using taskflow.Data.Entities;
using taskflow.Repositories.Interfaces;

namespace taskflow.Repositories
{
    public class UserRepository : GenericRepository<AppUser>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<AppUser?> GetByEmailAsync(string email)
        {
            var normalized = email.ToLower();
            return await _dbSet.FirstOrDefaultAsync(u => u.Email.ToLower() == normalized);
        }

        public async Task<AppUser> GetOrCreateShadowUserAsync(string email, string fullName)
        {
            var existing = await GetByEmailAsync(email);
            if (existing != null) return existing;

            var nameParts = (fullName ?? email).Trim().Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
            var shadow = new AppUser
            {
                Email = email.Trim().ToLowerInvariant(),
                FullName = fullName,
                FirstName = nameParts.Length > 0 ? nameParts[0] : fullName,
                LastName = nameParts.Length > 1 ? nameParts[1] : string.Empty,
                PasswordHash = "__SHADOW__",
                IsBackedUpToMongo = true,
                CreatedAt = DateTime.UtcNow,
            };

            await _dbSet.AddAsync(shadow);
            await _context.SaveChangesAsync();
            return shadow;
        }
    }
}
