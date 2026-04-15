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
    public class MessageRepository : GenericRepository<Message>, IMessageRepository
    {
        public MessageRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Message>> GetConversationAsync(int userId, int contactId)
        {
            return await _dbSet
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => (m.SenderId == userId && m.ReceiverId == contactId)
                         || (m.SenderId == contactId && m.ReceiverId == userId))
                .Where(m => !(m.SenderId == userId && m.IsDeletedBySender) &&
                            !(m.ReceiverId == userId && m.IsDeletedByReceiver))
                .OrderBy(m => m.SentAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<AppUser>> GetContactsAsync(int userId)
        {
            var sentToIds = _dbSet
                .Where(m => m.SenderId == userId && !m.IsDeletedBySender)
                .Select(m => m.ReceiverId);

            var receivedFromIds = _dbSet
                .Where(m => m.ReceiverId == userId && !m.IsDeletedByReceiver)
                .Select(m => m.SenderId);

            var contactIds = sentToIds.Union(receivedFromIds);

            return await _context.AppUsers
                .Where(u => contactIds.Contains(u.Id))
                .ToListAsync();
        }

        public async Task MarkConversationAsReadAsync(int userId, int contactId)
        {
            var unread = await _dbSet
                .Where(m => m.ReceiverId == userId && m.SenderId == contactId && !m.IsRead)
                .ToListAsync();

            foreach (var msg in unread)
                msg.IsRead = true;

            await _context.SaveChangesAsync();
        }

        public async Task MarkAllAsReadAsync(int userId)
        {
            var unread = await _dbSet
                .Where(m => m.ReceiverId == userId && !m.IsRead)
                .ToListAsync();

            foreach (var msg in unread)
                msg.IsRead = true;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteConversationAsync(int userId, int contactId, string senderFullName)
        {
            // Insert farewell system message visible only to the other person
            var farewell = new Message
            {
                SenderId = userId,
                ReceiverId = contactId,
                Body = $"{senderFullName} has left the chat",
                IsSystemMessage = true,
                IsDeletedBySender = true,   // leaver never sees it
                IsRead = false,
                SentAt = DateTime.UtcNow
            };
            await _dbSet.AddAsync(farewell);

            // Soft-delete all existing messages between the two users from userId's view
            var messages = await _dbSet
                .Where(m => (m.SenderId == userId && m.ReceiverId == contactId)
                         || (m.SenderId == contactId && m.ReceiverId == userId))
                .ToListAsync();

            foreach (var msg in messages)
            {
                if (msg.SenderId == userId)
                    msg.IsDeletedBySender = true;
                if (msg.ReceiverId == userId)
                    msg.IsDeletedByReceiver = true;
            }

            await _context.SaveChangesAsync();
        }
    }
}
