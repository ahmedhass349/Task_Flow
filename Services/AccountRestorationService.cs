using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using taskflow.Data.Entities;
using taskflow.Repositories.Interfaces;
using taskflow.Services.Interfaces;

namespace taskflow.Services
{
    public class AccountRestorationService : IAccountRestorationService
    {
        private readonly IMongoService _mongo;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<AccountRestorationService> _logger;

        public AccountRestorationService(
            IMongoService mongo,
            IUserRepository userRepository,
            ILogger<AccountRestorationService> logger)
        {
            _mongo = mongo;
            _userRepository = userRepository;
            _logger = logger;
        }

        public async Task<AppUser?> TryRestoreAsync(string email, string plaintextPassword)
        {
            // Step 1 — look for a credential backup in MongoDB
            var account = await _mongo.FindAccountForRestorationAsync(email);
            if (account == null)
            {
                // No backup found (user never registered, or app is offline)
                _logger.LogInformation("AccountRestoration: no backup found for {Email}", email);
                return null;
            }

            // Step 2 — verify password against the stored BCrypt hash
            bool valid = BCrypt.Net.BCrypt.Verify(plaintextPassword, account.PasswordHash);
            if (!valid)
            {
                // Backup exists but password is wrong — this is an auth failure, not a restoration failure
                _logger.LogWarning("AccountRestoration: password mismatch for {Email}", email);
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

            // Step 3 — fetch public profile from user_presence to populate name/avatar fields
            string fullName = string.Empty;
            string? avatarUrl = null;
            string? company = null;
            string? country = null;
            string? phone = null;
            string? timezone = null;

            var presenceResults = await _mongo.SearchUsersAsync(email, excludeEmail: "__no_match__");
            foreach (var p in presenceResults)
            {
                if (string.Equals(p.Email, email.Trim(), StringComparison.OrdinalIgnoreCase))
                {
                    fullName = p.FullName ?? string.Empty;
                    avatarUrl = p.AvatarUrl;
                    break;
                }
            }

            // Step 4 — recreate the AppUser in SQLite
            var nameParts = fullName.Trim().Split(' ', 2);
            string firstName = nameParts[0];
            string lastName = nameParts.Length > 1 ? nameParts[1] : string.Empty;

            var restored = new AppUser
            {
                FullName = fullName,
                FirstName = firstName,
                LastName = lastName,
                Email = email.Trim().ToLowerInvariant(),
                PasswordHash = account.PasswordHash,   // re-use the stored BCrypt hash — no rehash needed
                AvatarUrl = avatarUrl,
                Company = company,
                Country = country,
                Phone = phone,
                Timezone = timezone,
                CreatedAt = DateTime.UtcNow,            // local device creation time
                IsBackedUpToMongo = true                // already in MongoDB
            };

            await _userRepository.AddAsync(restored);
            await _userRepository.SaveChangesAsync();

            _logger.LogInformation("AccountRestoration: successfully restored {Email} (new SQLite id={Id})",
                email, restored.Id);

            return restored;
        }
    }
}
