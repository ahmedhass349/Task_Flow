using System.Collections.Generic;
using System.Threading.Tasks;
using taskflow.DTOs.Messages;

namespace taskflow.Services.Interfaces
{
    public interface IMessageService
    {
        Task<IEnumerable<ContactDto>> GetContactsAsync(int userId);
        Task<IEnumerable<MessageDto>> GetConversationAsync(int userId, int contactId);
        Task<MessageDto> SendMessageAsync(int userId, SendMessageRequest request);
    }
}
