using System.Collections.Generic;
using System.Threading.Tasks;
using taskflow.Data.Entities;

namespace taskflow.Repositories.Interfaces
{
    public interface IMessageRepository : IGenericRepository<Message>
    {
        Task<IEnumerable<Message>> GetConversationAsync(int userId, int contactId);
        Task<IEnumerable<AppUser>> GetContactsAsync(int userId);
        Task MarkConversationAsReadAsync(int userId, int contactId);
        Task MarkAllAsReadAsync(int userId);
        Task DeleteConversationAsync(int userId, int contactId, string senderFullName);
    }
}
