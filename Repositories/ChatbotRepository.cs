using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using taskflow.Data;
using taskflow.Data.Entities;
using taskflow.Repositories.Interfaces;

namespace taskflow.Repositories
{
    public class ChatbotRepository : GenericRepository<ChatbotConversation>, IChatbotRepository
    {
        public ChatbotRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<ChatbotConversation>> GetUserConversationsAsync(int userId)
        {
            return await _dbSet
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.UpdatedAt)
                .ToListAsync();
        }

        public async Task<ChatbotConversation?> GetConversationWithMessagesAsync(int conversationId)
        {
            return await _dbSet
                .Include(c => c.Messages.OrderBy(m => m.CreatedAt))
                .FirstOrDefaultAsync(c => c.Id == conversationId);
        }
    }
}
