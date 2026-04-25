// FILE: Services/SettingsService.cs
// STATUS: UPDATED
// CHANGES: Updated UpdateProfileAsync to use FirstName/LastName (#24)

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using taskflow.Data;
using taskflow.Data.Entities;
using taskflow.DTOs.Settings;
using taskflow.DTOs.Auth;
using taskflow.Repositories.Interfaces;
using taskflow.Services.Interfaces;
using taskflow.Helpers;

namespace taskflow.Services
{
    public class SettingsService : ISettingsService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly JwtHelper _jwtHelper;
        private readonly IMongoService _mongoService;
        private readonly AppDbContext _context;

        public SettingsService(IUserRepository userRepository, IMapper mapper, JwtHelper jwtHelper, IMongoService mongoService, AppDbContext context)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _jwtHelper = jwtHelper;
            _mongoService = mongoService;
            _context = context;
        }

        public async Task<ProfileDto> GetProfileAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found.");

            return _mapper.Map<ProfileDto>(user);
        }

        public async Task<AuthResponse> UpdateProfileAsync(int userId, UpdateProfileRequest request)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found.");

            // Update FirstName/LastName and keep FullName in sync (#24)
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.FullName = $"{request.FirstName} {request.LastName}".Trim();

            if (!string.IsNullOrEmpty(request.Email))
            {
                var existingUser = await _userRepository.GetByEmailAsync(request.Email);
                if (existingUser != null && existingUser.Id != userId)
                    throw new InvalidOperationException("Email is already in use by another account.");

                user.Email = request.Email;
            }

            user.AvatarUrl = request.AvatarUrl;
            user.Company = request.Company;
            user.Country = request.Country;
            user.Phone = request.Phone;
            user.Timezone = request.Timezone;

            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            // Generate new token with updated claims
            var newToken = _jwtHelper.GenerateToken(user);
            var userDto = _mapper.Map<UserDto>(user);

            return new AuthResponse
            {
                Token = newToken,
                User = userDto
            };
        }

        public async Task ChangePasswordAsync(int userId, ChangePasswordRequest request)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found.");

            bool validPassword = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash);
            if (!validPassword)
                throw new UnauthorizedAccessException("Current password is incorrect.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();
        }

        public async Task DeleteAccountAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found.");

            // 1. Delete direct messages (Restrict on SenderId and ReceiverId)
            var messages = await _context.Messages
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .ToListAsync();
            _context.Messages.RemoveRange(messages);

            // 2. Delete task comments authored by this user (Restrict on AuthorId)
            var comments = await _context.TaskComments
                .Where(c => c.AuthorId == userId)
                .ToListAsync();
            _context.TaskComments.RemoveRange(comments);

            // 3. Delete group messages sent by this user in any group chat (Restrict on SenderId)
            var groupMessages = await _context.GroupMessages
                .Where(gm => gm.SenderId == userId)
                .ToListAsync();
            _context.GroupMessages.RemoveRange(groupMessages);

            // 4. Delete group chats created by this user (cascades members + remaining messages)
            var groupChats = await _context.GroupChats
                .Where(g => g.CreatedByUserId == userId)
                .ToListAsync();
            _context.GroupChats.RemoveRange(groupChats);

            // 5. Delete projects owned by this user (cascades project members; sets null on tasks)
            var projects = await _context.Projects
                .Where(p => p.OwnerId == userId)
                .ToListAsync();
            _context.Projects.RemoveRange(projects);

            // 6. Delete teams owned by this user (cascades team members)
            var teams = await _context.Teams
                .Where(t => t.OwnerId == userId)
                .ToListAsync();
            _context.Teams.RemoveRange(teams);

            // 7. Clean up all MongoDB data for this user
            await _mongoService.DeleteUserDataAsync(user.Email);

            // 8. Remove the user — remaining EF cascades handle notifications, reminders,
            //    calendar events, chatbot conversations, and all remaining memberships.
            _userRepository.Remove(user);
            await _userRepository.SaveChangesAsync();
        }
    }
}
