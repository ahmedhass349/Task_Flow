using System.Collections.Generic;
using System.Threading.Tasks;
using taskflow.DTOs.GroupChats;

namespace taskflow.Repositories.Interfaces
{
    public interface IGroupChatRepository
    {
        Task<List<Data.Entities.GroupChat>> GetUserGroupChatsAsync(int userId);
        Task<Data.Entities.GroupChat?> GetByIdAsync(int groupChatId);
        Task<bool> IsMemberAsync(int groupChatId, int userId);
        Task<Data.Entities.GroupChat> CreateAsync(Data.Entities.GroupChat groupChat);
        Task<List<Data.Entities.GroupMessage>> GetMessagesAsync(int groupChatId, int take = 100);
        Task<Data.Entities.GroupMessage> AddMessageAsync(Data.Entities.GroupMessage message);
        Task UpdateLastReadAsync(int groupChatId, int userId, System.DateTime readAt);
        Task<int> GetUnreadCountAsync(int groupChatId, int userId);
        Task LeaveGroupAsync(int groupChatId, int userId);
        Task<Data.Entities.GroupMessage?> GetLastMessageAsync(int groupChatId);
    }
}
