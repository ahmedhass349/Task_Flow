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

        public AuthService(IUserRepository userRepository, JwtHelper jwtHelper, IMapper mapper, IMirrorService mirror)
        {
            _userRepository = userRepository;
            _jwtHelper = jwtHelper;
            _mapper = mapper;
            _mirror = mirror;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null)
                throw new UnauthorizedAccessException("Invalid email or password.");

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
