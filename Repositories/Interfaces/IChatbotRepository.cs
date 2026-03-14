using System.Collections.Generic;
using System.Threading.Tasks;
using taskflow.Data.Entities;

namespace taskflow.Repositories.Interfaces
{
    public interface IChatbotRepository : IGenericRepository<ChatbotConversation>
    {
        Task<IEnumerable<ChatbotConversation>> GetUserConversationsAsync(int userId);
        Task<ChatbotConversation?> GetConversationWithMessagesAsync(int conversationId);
    }
}
