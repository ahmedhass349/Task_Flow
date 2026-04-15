using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using taskflow.Data;
using taskflow.Data.Entities;
using taskflow.Repositories.Interfaces;

namespace taskflow.Repositories
{
    public class GroupChatRepository : IGroupChatRepository
    {
        private readonly AppDbContext _db;

        public GroupChatRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<GroupChat>> GetUserGroupChatsAsync(int userId)
        {
            return await _db.GroupChats
                .Where(g => g.Members.Any(m => m.UserId == userId))
                .Include(g => g.Members).ThenInclude(m => m.User)
                .Include(g => g.CreatedBy)
                .OrderByDescending(g => g.CreatedAt)
                .ToListAsync();
        }

        public async Task<GroupChat?> GetByIdAsync(int groupChatId)
        {
            return await _db.GroupChats
                .Include(g => g.Members).ThenInclude(m => m.User)
                .Include(g => g.CreatedBy)
                .FirstOrDefaultAsync(g => g.Id == groupChatId);
        }

        public async Task<bool> IsMemberAsync(int groupChatId, int userId)
        {
            return await _db.GroupChatMembers
                .AnyAsync(m => m.GroupChatId == groupChatId && m.UserId == userId);
        }

        public async Task<GroupChat> CreateAsync(GroupChat groupChat)
        {
            _db.GroupChats.Add(groupChat);
            await _db.SaveChangesAsync();
            return groupChat;
        }

        public async Task<List<GroupMessage>> GetMessagesAsync(int groupChatId, int take = 100)
        {
            return await _db.GroupMessages
                .Where(m => m.GroupChatId == groupChatId)
                .Include(m => m.Sender)
                .OrderBy(m => m.SentAt)
                .TakeLast(take)
                .ToListAsync();
        }

        public async Task<GroupMessage> AddMessageAsync(GroupMessage message)
        {
            _db.GroupMessages.Add(message);
            await _db.SaveChangesAsync();
            return message;
        }

        public async Task UpdateLastReadAsync(int groupChatId, int userId, DateTime readAt)
        {
            var member = await _db.GroupChatMembers
                .FirstOrDefaultAsync(m => m.GroupChatId == groupChatId && m.UserId == userId);
            if (member != null)
            {
                member.LastReadAt = readAt;
                await _db.SaveChangesAsync();
            }
        }

        public async Task<int> GetUnreadCountAsync(int groupChatId, int userId)
        {
            var member = await _db.GroupChatMembers
                .FirstOrDefaultAsync(m => m.GroupChatId == groupChatId && m.UserId == userId);
            if (member == null) return 0;

            var since = member.LastReadAt ?? DateTime.MinValue;
            return await _db.GroupMessages
                .CountAsync(m => m.GroupChatId == groupChatId && m.SentAt > since && m.SenderId != userId);
        }

        public async Task LeaveGroupAsync(int groupChatId, int userId)
        {
            var member = await _db.GroupChatMembers
                .FirstOrDefaultAsync(m => m.GroupChatId == groupChatId && m.UserId == userId);
            if (member != null)
            {
                _db.GroupChatMembers.Remove(member);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<GroupMessage?> GetLastMessageAsync(int groupChatId)
        {
            return await _db.GroupMessages
                .Where(m => m.GroupChatId == groupChatId)
                .Include(m => m.Sender)
                .OrderByDescending(m => m.SentAt)
                .FirstOrDefaultAsync();
        }
    }
}
