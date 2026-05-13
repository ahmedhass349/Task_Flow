// FILE: Services/AuthService.cs
// STATUS: UPDATED
// CHANGES: Fixed ResetPasswordAsync to validate ResetToken (#1),
//          ForgotPasswordAsync now generates reset token (#18),
//          RegisterAsync now sets FirstName/LastName (#24)

using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Threading.Tasks;
using AutoMapper;
using taskflow.Data.Entities;
using taskflow.DTOs.Auth;
using taskflow.Helpers;
using taskflow.Repositories.Interfaces;
using taskflow.Services.Interfaces;

namespace taskflow.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtHelper _jwtHelper;
        private readonly IMapper _mapper;
        private readonly IMirrorService _mirror;
        private readonly IMongoService _mongo;
        private readonly IAccountRestorationService _restoration;

        // SEC-03: Pre-computed BCrypt hash used solely for constant-time dummy verification.
        // When no MongoDB backup exists the login path would otherwise return immediately (fast),
        // letting an attacker enumerate registered e-mails by measuring response time.
        // BCrypt.Verify against this hash normalises the ~100 ms wall-clock cost to match the
        // "backup found, wrong password" path.  The plaintext that produced this hash is irrelevant.
        private static readonly string _dummyPasswordHash =
            BCrypt.Net.BCrypt.HashPassword("__taskflow_noop__", workFactor: 11);

        public AuthService(
            IUserRepository userRepository,
            JwtHelper jwtHelper,
            IMapper mapper,
            IMirrorService mirror,
            IMongoService mongo,
            IAccountRestorationService restoration)
        {
            _userRepository = userRepository;
            _jwtHelper = jwtHelper;
            _mapper = mapper;
            _mirror = mirror;
            _mongo = mongo;
            _restoration = restoration;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);

            if (user == null)
            {
                // User not found locally — may be a fresh install or database wipe.
                // Attempt to restore credentials from the MongoDB backup.
                // TryRestoreAsync: returns null if no backup found (offline or unknown user),
                //                  throws UnauthorizedAccessException on password mismatch.
                user = await _restoration.TryRestoreAsync(request.Email, request.Password);
                if (user == null)
                {
                    // SEC-03: dummy check to normalise timing — prevents email enumeration
                    // via response-time difference between "unknown email" and "wrong password".
                    BCrypt.Net.BCrypt.Verify(request.Password, _dummyPasswordHash);
                    throw new UnauthorizedAccessException("Invalid email or password.");
                }

                // Password already verified inside TryRestoreAsync — generate token directly.
                user.LastLoginAt = DateTime.UtcNow;
                _userRepository.Update(user);
                await _userRepository.SaveChangesAsync();

                var restoredToken = _jwtHelper.GenerateToken(user);
                var restoredDto = _mapper.Map<UserDto>(user);
                return new AuthResponse { Token = restoredToken, User = restoredDto, IsRestored = true };
            }

            bool validPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!validPassword)
                throw new UnauthorizedAccessException("Invalid email or password.");

            // Update last login timestamp
            user.LastLoginAt = DateTime.UtcNow;
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            var token = _jwtHelper.GenerateToken(user);
            var userDto = _mapper.Map<UserDto>(user);

            return new AuthResponse
            {
                Token = token,
                User = userDto
            };
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            var existingUser = await _userRepository.GetByEmailAsync(request.Email);
            if (existingUser != null)
                throw new InvalidOperationException("A user with this email already exists.");

            // Split FullName into FirstName/LastName for the new fields (#24)
            var nameParts = (request.FullName ?? "").Trim().Split(' ', 2);
            string firstName = nameParts[0];
            string lastName = nameParts.Length > 1 ? nameParts[1] : string.Empty;

            var user = new AppUser
            {
                FullName = request.FullName ?? string.Empty,
                FirstName = firstName,
                LastName = lastName,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Company = request.Company,
                Country = request.Country,
                Phone = request.Phone,
                Timezone = request.Timezone,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            // Back up BCrypt credentials to MongoDB so the account can be restored after reinstall.
            // This is best-effort: if offline the backup is queued; BulkSyncStartupService retries
            // any record where IsBackedUpToMongo is still false.
            try
            {
                await _mongo.BackupUserAccountAsync(user.Email, user.PasswordHash, user.Id);
                user.IsBackedUpToMongo = true;
                _userRepository.Update(user);
                await _userRepository.SaveChangesAsync();
            }
            catch
            {
                // Swallow — registration must not fail because of a MongoDB backup failure.
            }

            // Mirror a safe projection — explicitly exclude PasswordHash, ResetToken, ResetTokenExpiry
            // and all navigation collections to avoid storing credentials in MongoDB.
            _mirror.Mirror("users", user.Id, new {
                user.Id,
                user.FullName,
                user.FirstName,
                user.LastName,
                user.Email,
                user.AvatarUrl,
                user.Company,
                user.Country,
                user.Phone,
                user.Timezone,
                user.CreatedAt,
                user.LastLoginAt
            });

            var token = _jwtHelper.GenerateToken(user);
            var userDto = _mapper.Map<UserDto>(user);

            return new AuthResponse
            {
                Token = token,
                User = userDto
            };
        }

        // Alphanumeric charset — excludes visually ambiguous chars (I, O, 0, 1)
        private static readonly char[] CodeChars =
            "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".ToCharArray();

        private static string GenerateRecoveryCode()
        {
            var bytes = RandomNumberGenerator.GetBytes(8);
            var part1 = new char[4];
            var part2 = new char[4];
            for (int i = 0; i < 4; i++)
                part1[i] = CodeChars[bytes[i] % CodeChars.Length];
            for (int i = 0; i < 4; i++)
                part2[i] = CodeChars[bytes[4 + i] % CodeChars.Length];
            return $"{new string(part1)}-{new string(part2)}";
        }

        public async Task ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null)
                throw new KeyNotFoundException("No account found with this email address.");

            var code = GenerateRecoveryCode();
            user.ResetToken = code;
            user.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(15);

            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            // Write code to a local temp file; the Electron main process reads it via
            // IPC ('read-reset-code') and deletes it. The code is never returned in
            // the HTTP response body.
            var tmpPath = Path.Combine(Path.GetTempPath(), "taskflow_reset_pending.tmp");
            await File.WriteAllTextAsync(tmpPath, code);
        }

        public async Task ResetPasswordAsync(ResetPasswordRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null)
                throw new KeyNotFoundException("No account found with this email address.");

            // Validate the reset token (#1)
            if (string.IsNullOrEmpty(user.ResetToken) ||
                !string.Equals(user.ResetToken, request.Token.ToUpperInvariant(), StringComparison.Ordinal) ||
                !user.ResetTokenExpiry.HasValue ||
                user.ResetTokenExpiry.Value < DateTime.UtcNow)
            {
                throw new UnauthorizedAccessException("Invalid or expired reset token.");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.ResetToken = null;
            user.ResetTokenExpiry = null;

            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            // Update the MongoDB credential backup with the new BCrypt hash so that
            // cross-device login (after reinstall) works with the updated password.
            try
            {
                await _mongo.BackupUserAccountAsync(user.Email, user.PasswordHash, user.Id);
            }
            catch
            {
                // Best-effort — password reset must succeed even if MongoDB is unreachable.
            }
        }

        public async Task<UserDto> GetCurrentUserAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found.");

            return _mapper.Map<UserDto>(user);
        }
    }
}
