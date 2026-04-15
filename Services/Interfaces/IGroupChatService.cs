using System.Collections.Generic;
using System.Threading.Tasks;
using taskflow.DTOs.GroupChats;

namespace taskflow.Services.Interfaces
{
    public interface IGroupChatService
    {
        Task<List<GroupChatDto>> GetUserGroupChatsAsync(int userId);
        Task<GroupChatDto> CreateGroupChatAsync(int creatorUserId, CreateGroupChatRequest request);
        Task<List<GroupMessageDto>> GetGroupMessagesAsync(int groupChatId, int requestingUserId);
        Task<GroupMessageDto> SendGroupMessageAsync(int groupChatId, int senderUserId, SendGroupMessageRequest request);
        Task MarkGroupAsReadAsync(int groupChatId, int userId);
        Task LeaveGroupAsync(int groupChatId, int userId);
    }
}
