using System.Collections.Generic;
using System.Threading.Tasks;
using taskflow.DTOs.Chatbot;

namespace taskflow.Services.Interfaces
{
    public interface IChatbotService
    {
        Task<IEnumerable<ConversationListDto>> GetConversationsAsync(int userId);
        Task<ConversationDto> GetConversationAsync(int userId, int conversationId);
        Task<ConversationDto> CreateConversationAsync(int userId, CreateConversationRequest request);
        Task<ChatbotMessageDto> SendMessageAsync(int userId, int conversationId, SendChatbotMessageRequest request);
        Task DeleteConversationAsync(int userId, int conversationId);

        /// <summary>Persists the user message and returns the full history for streaming.</summary>
        Task<StreamState> BeginStreamAsync(int userId, int conversationId, SendChatbotMessageRequest request);

        /// <summary>Persists the accumulated bot reply after streaming completes.</summary>
        Task<ChatbotMessageDto> CommitStreamAsync(int userId, int conversationId, string accumulated);

        /// <summary>Renames a conversation's title.</summary>
        Task UpdateTitleAsync(int userId, int conversationId, string title);

        /// <summary>Deletes all conversations (and their messages) for the given user. Returns the count deleted.</summary>
        Task<int> ClearAllConversationsAsync(int userId);

        /// <summary>Edits a user message, deletes subsequent messages, and returns history ready for re-streaming.</summary>
        Task<StreamState> EditMessageAndBeginStreamAsync(int userId, int conversationId, int messageId, EditMessageRequest request);
    }
}
