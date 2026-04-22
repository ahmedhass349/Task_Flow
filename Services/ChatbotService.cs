// FILE: Services/ChatbotService.cs

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using taskflow.Data.Entities;
using taskflow.DTOs.Chatbot;
using taskflow.Repositories.Interfaces;
using taskflow.Services.Interfaces;

namespace taskflow.Services
{
    public class ChatbotService : IChatbotService
    {
        private readonly IChatbotRepository _chatbotRepository;
        private readonly IGenericRepository<ChatbotMessage> _chatbotMessageRepository;
        private readonly IMapper _mapper;
        private readonly IMirrorService _mirror;
        private readonly IMistralChatService _mistral;
        private readonly IGenericRepository<TaskItem> _taskRepo;
        private readonly IGenericRepository<Project> _projectRepo;
        private readonly IGenericRepository<Notification> _notificationRepo;
        private readonly IGenericRepository<AppUser> _userRepo;
        private readonly int _historyWindow;

        public ChatbotService(
            IChatbotRepository chatbotRepository,
            IGenericRepository<ChatbotMessage> chatbotMessageRepository,
            IMapper mapper,
            IMirrorService mirror,
            IMistralChatService mistral,
            IGenericRepository<TaskItem> taskRepo,
            IGenericRepository<Project> projectRepo,
            IGenericRepository<Notification> notificationRepo,
            IGenericRepository<AppUser> userRepo,
            IConfiguration configuration)
        {
            _chatbotRepository = chatbotRepository;
            _chatbotMessageRepository = chatbotMessageRepository;
            _mapper = mapper;
            _mirror = mirror;
            _mistral = mistral;
            _taskRepo = taskRepo;
            _projectRepo = projectRepo;
            _notificationRepo = notificationRepo;
            _userRepo = userRepo;
            _historyWindow = configuration.GetValue<int>("Mistral:HistoryWindow", 20);
        }

        public async Task<IEnumerable<ConversationListDto>> GetConversationsAsync(int userId)
        {
            var conversations = await _chatbotRepository.GetUserConversationsAsync(userId);

            return conversations.Select(c =>
            {
                var lastMsg = c.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault();
                var preview = lastMsg?.Text;
                if (preview != null && preview.Length > 100)
                    preview = preview[..97] + "...";

                return new ConversationListDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    UpdatedAt = c.UpdatedAt,
                    MessageCount = c.Messages.Count,
                    LastMessagePreview = preview
                };
            }).OrderByDescending(c => c.UpdatedAt);
        }

        public async Task<ConversationDto> GetConversationAsync(int userId, int conversationId)
        {
            var conversation = await _chatbotRepository.GetConversationWithMessagesAsync(conversationId);
            if (conversation == null)
                throw new KeyNotFoundException($"Conversation with ID {conversationId} not found.");

            // Ownership check (#2)
            if (conversation.UserId != userId)
                throw new UnauthorizedAccessException("You do not have permission to access this conversation.");

            return new ConversationDto
            {
                Id = conversation.Id,
                Title = conversation.Title,
                UpdatedAt = conversation.UpdatedAt,
                Messages = conversation.Messages
                    .OrderBy(m => m.CreatedAt)
                    .Select(m => new ChatbotMessageDto
                    {
                        Id = m.Id,
                        Role = m.Role,
                        Text = m.Text,
                        IsEdited = m.IsEdited,
                        CreatedAt = m.CreatedAt
                    }).ToList()
            };
        }

        public async Task<ConversationDto> CreateConversationAsync(int userId, CreateConversationRequest request)
        {
            var conversation = new ChatbotConversation
            {
                Title = request.Title,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _chatbotRepository.AddAsync(conversation);
            await _chatbotRepository.SaveChangesAsync();
            _mirror.Mirror("chatbot_conversations", conversation.Id, conversation);

            return new ConversationDto
            {
                Id = conversation.Id,
                Title = conversation.Title,
                UpdatedAt = conversation.UpdatedAt,
                Messages = new List<ChatbotMessageDto>()
            };
        }

        public async Task<ChatbotMessageDto> SendMessageAsync(int userId, int conversationId, SendChatbotMessageRequest request)
        {
            // Load conversation WITH message history so we can send full context to Mistral
            var conversation = await _chatbotRepository.GetConversationWithMessagesAsync(conversationId);
            if (conversation == null)
                throw new KeyNotFoundException($"Conversation with ID {conversationId} not found.");

            // Ownership check
            if (conversation.UserId != userId)
                throw new UnauthorizedAccessException("You do not have permission to send messages in this conversation.");

            // Persist the user message first
            var userMessage = new ChatbotMessage
            {
                ConversationId = conversationId,
                Role = "user",
                Text = request.Text,
                CreatedAt = DateTime.UtcNow
            };

            await _chatbotMessageRepository.AddAsync(userMessage);
            await _chatbotMessageRepository.SaveChangesAsync();

            // Build history including the new message — apply history window
            var windowedHistory = conversation.Messages
                .OrderBy(m => m.CreatedAt)
                .TakeLast(_historyWindow - 1)   // leave room for the new user message
                .Select(m => (m.Role, m.Text))
                .Append(("user", request.Text));

            // Call Mistral for a real response
            string replyText;
            try
            {
                var systemPrompt = await BuildSystemPromptAsync(userId);
                replyText = await _mistral.ChatAsync(windowedHistory, systemPrompt);
            }
            catch (Exception ex)
            {
                replyText = $"I'm sorry, I encountered an error while processing your request. Please try again. ({ex.Message})";
            }

            var botMessage = new ChatbotMessage
            {
                ConversationId = conversationId,
                Role = "assistant",
                Text = replyText,
                CreatedAt = DateTime.UtcNow.AddMilliseconds(1)
            };

            await _chatbotMessageRepository.AddAsync(botMessage);

            conversation.UpdatedAt = DateTime.UtcNow;
            _chatbotRepository.Update(conversation);

            await _chatbotMessageRepository.SaveChangesAsync();
            _mirror.Mirror("chatbot_messages", userMessage.Id, userMessage);
            _mirror.Mirror("chatbot_messages", botMessage.Id, botMessage);

            return new ChatbotMessageDto
            {
                Id = botMessage.Id,
                Role = botMessage.Role,
                Text = botMessage.Text,
                CreatedAt = botMessage.CreatedAt
            };
        }

        public async Task DeleteConversationAsync(int userId, int conversationId)
        {
            var conversation = await _chatbotRepository.GetConversationWithMessagesAsync(conversationId);
            if (conversation == null)
                throw new KeyNotFoundException($"Conversation with ID {conversationId} not found.");

            // Ownership check (#2)
            if (conversation.UserId != userId)
                throw new UnauthorizedAccessException("You do not have permission to delete this conversation.");

            // Remove all messages first
            foreach (var message in conversation.Messages.ToList())
            {
                _chatbotMessageRepository.Remove(message);
            }

            _chatbotRepository.Remove(conversation);
            await _chatbotRepository.SaveChangesAsync();
            _mirror.Erase("chatbot_conversations", conversationId);
        }

        public async Task<StreamState> BeginStreamAsync(int userId, int conversationId, SendChatbotMessageRequest request)
        {
            var conversation = await _chatbotRepository.GetConversationWithMessagesAsync(conversationId);
            if (conversation == null)
                throw new KeyNotFoundException($"Conversation with ID {conversationId} not found.");

            if (conversation.UserId != userId)
                throw new UnauthorizedAccessException("You do not have permission to send messages in this conversation.");

            // Build the effective user text: prepend file content if attached
            string userText = request.Text;
            if (!string.IsNullOrWhiteSpace(request.FileContent))
            {
                var header = string.IsNullOrWhiteSpace(request.FileName)
                    ? "[Attached file content]"
                    : $"[Attached file: {request.FileName}]";
                userText = $"{header}\n{request.FileContent}\n\n---\n{request.Text}";
            }

            // Persist the user message
            var userMessage = new ChatbotMessage
            {
                ConversationId = conversationId,
                Role = "user",
                Text = userText,
                CreatedAt = DateTime.UtcNow
            };
            await _chatbotMessageRepository.AddAsync(userMessage);
            await _chatbotMessageRepository.SaveChangesAsync();
            _mirror.Mirror("chatbot_messages", userMessage.Id, userMessage);

            // Build history including the new message — apply history window
            var windowedHistory = conversation.Messages
                .OrderBy(m => m.CreatedAt)
                .TakeLast(_historyWindow - 1)   // leave room for the new user message
                .Select(m => (m.Role, m.Text))
                .Append(("user", userText));

            // Build context-aware system prompt
            var systemPrompt = await BuildSystemPromptAsync(userId);

            // Detect whether this is the first user→bot exchange (for auto-titling)
            bool isFirstMessage = !conversation.Messages.Any(m => m.Role == "assistant");

            return new StreamState
            {
                History = windowedHistory,
                SystemPrompt = systemPrompt,
                IsFirstMessage = isFirstMessage,
                AttachedFileBase64 = request.AttachedFileBase64,
                AttachedFileMimeType = request.AttachedFileMimeType,
                ChatMode = request.ChatMode
            };
        }

        public async Task<ChatbotMessageDto> CommitStreamAsync(int userId, int conversationId, string accumulated)
        {
            var conversation = await _chatbotRepository.GetConversationWithMessagesAsync(conversationId);
            if (conversation == null)
                throw new KeyNotFoundException($"Conversation with ID {conversationId} not found.");

            if (conversation.UserId != userId)
                throw new UnauthorizedAccessException("You do not have permission to modify this conversation.");

            // Detect first bot reply before we persist (used for auto-titling)
            bool isFirstBotReply = !conversation.Messages.Any(m => m.Role == "assistant");
            var firstUserMsg = conversation.Messages
                .OrderBy(m => m.CreatedAt)
                .FirstOrDefault(m => m.Role == "user")?.Text;

            var botMessage = new ChatbotMessage
            {
                ConversationId = conversationId,
                Role = "assistant",
                Text = accumulated,
                CreatedAt = DateTime.UtcNow
            };
            await _chatbotMessageRepository.AddAsync(botMessage);

            conversation.UpdatedAt = DateTime.UtcNow;

            // Auto-title: generate a meaningful title on the very first reply
            if (isFirstBotReply && !string.IsNullOrWhiteSpace(firstUserMsg)
                && (string.IsNullOrWhiteSpace(conversation.Title) || conversation.Title == "New Conversation"))
            {
                try
                {
                    conversation.Title = await _mistral.GenerateTitleAsync(firstUserMsg);
                }
                catch
                {
                    // Auto-title is best-effort; leave the existing title if it fails
                }
            }

            _chatbotRepository.Update(conversation);

            await _chatbotMessageRepository.SaveChangesAsync();
            _mirror.Mirror("chatbot_messages", botMessage.Id, botMessage);

            return new ChatbotMessageDto
            {
                Id = botMessage.Id,
                Role = botMessage.Role,
                Text = botMessage.Text,
                CreatedAt = botMessage.CreatedAt
            };
        }

        public async Task UpdateTitleAsync(int userId, int conversationId, string title)
        {
            var conversation = await _chatbotRepository.GetConversationWithMessagesAsync(conversationId);
            if (conversation == null)
                throw new KeyNotFoundException($"Conversation with ID {conversationId} not found.");

            if (conversation.UserId != userId)
                throw new UnauthorizedAccessException("You do not have permission to modify this conversation.");

            conversation.Title = title;
            conversation.UpdatedAt = DateTime.UtcNow;
            _chatbotRepository.Update(conversation);
            await _chatbotRepository.SaveChangesAsync();
        }

        public async Task<int> ClearAllConversationsAsync(int userId)
        {
            var conversations = (await _chatbotRepository.GetUserConversationsAsync(userId)).ToList();

            foreach (var conv in conversations)
            {
                foreach (var msg in conv.Messages.ToList())
                    _chatbotMessageRepository.Remove(msg);

                _chatbotRepository.Remove(conv);
                _mirror.Erase("chatbot_conversations", conv.Id);
            }

            await _chatbotRepository.SaveChangesAsync();
            return conversations.Count;
        }

        public async Task<StreamState> EditMessageAndBeginStreamAsync(int userId, int conversationId, int messageId, EditMessageRequest request)
        {
            var conversation = await _chatbotRepository.GetConversationWithMessagesAsync(conversationId);
            if (conversation == null)
                throw new KeyNotFoundException($"Conversation with ID {conversationId} not found.");

            if (conversation.UserId != userId)
                throw new UnauthorizedAccessException("You do not have permission to modify this conversation.");

            var message = conversation.Messages.FirstOrDefault(m => m.Id == messageId);
            if (message == null || message.Role != "user")
                throw new KeyNotFoundException($"User message with ID {messageId} not found in conversation {conversationId}.");

            // Update the message text and mark as edited
            message.Text = request.Text;
            message.IsEdited = true;
            _chatbotMessageRepository.Update(message);

            // Delete all messages that came after this one
            var messagesAfter = conversation.Messages
                .Where(m => m.CreatedAt > message.CreatedAt)
                .ToList();
            foreach (var m in messagesAfter)
                _chatbotMessageRepository.Remove(m);

            await _chatbotMessageRepository.SaveChangesAsync();

            // Build windowed history up to and including the edited message
            var historyMessages = conversation.Messages
                .Where(m => m.CreatedAt <= message.CreatedAt)
                .OrderBy(m => m.CreatedAt)
                .ToList();

            var windowedHistory = historyMessages
                .TakeLast(_historyWindow)
                .Select(m => (m.Role, m.Id == messageId ? request.Text : m.Text));

            var systemPrompt = await BuildSystemPromptAsync(userId);

            return new StreamState
            {
                History = windowedHistory,
                SystemPrompt = systemPrompt,
                IsFirstMessage = false,
                AttachedFileBase64 = null,
                AttachedFileMimeType = null,
                ChatMode = request.ChatMode
            };
        }

        // ── Private helpers ───────────────────────────────────────────────

        private async Task<string> BuildSystemPromptAsync(int userId)
        {
            var sb = new StringBuilder();

            // User profile
            try
            {
                var users = await _userRepo.FindAsync(u => u.Id == userId);
                var user = users.FirstOrDefault();
                if (user != null)
                {
                    sb.Append($"You are TaskFlow AI, an intelligent assistant for {user.FullName}.");
                    if (!string.IsNullOrWhiteSpace(user.Timezone))
                        sb.Append($" The user's timezone is {user.Timezone}.");
                    sb.Append(" You are embedded in a task and project management application. " +
                              "Help users plan tasks, summarise projects, draft messages to teammates, " +
                              "suggest prioritisation strategies, set goals, and answer any workspace-related " +
                              "questions. Be concise, practical, and action-oriented.");
                }
                else
                {
                    sb.Append("You are TaskFlow AI, an intelligent assistant embedded in a task and project management application. " +
                              "Help users plan tasks, summarise projects, draft messages to teammates, suggest prioritisation strategies, " +
                              "set goals, and answer any workspace-related questions. Be concise, practical, and action-oriented.");
                }
            }
            catch
            {
                sb.Append("You are TaskFlow AI, an intelligent assistant embedded in a task and project management application. " +
                          "Help users plan tasks, summarise projects, draft messages to teammates, suggest prioritisation strategies, " +
                          "set goals, and answer any workspace-related questions. Be concise, practical, and action-oriented.");
            }

            try
            {
                var projects = await _projectRepo.FindAsync(p => p.OwnerId == userId);
                var projectList = projects.ToList();
                if (projectList.Any())
                {
                    sb.Append("\n\nUser's active projects: ");
                    sb.Append(string.Join(", ", projectList.Take(10).Select(p => p.Name)));
                }

                var tasks = await _taskRepo.FindAsync(
                    t => t.AssigneeId == userId &&
                         t.Status != Data.Entities.TaskStatus.Completed &&
                         t.Status != Data.Entities.TaskStatus.Overdue);
                var taskList = tasks.OrderBy(t => t.DueDate).ToList();
                if (taskList.Any())
                {
                    sb.Append("\n\nOpen tasks: ");
                    sb.Append(string.Join("; ", taskList.Take(15).Select(t =>
                        $"{t.Title} [{t.Priority}, {t.Status}" +
                        $"{(t.DueDate.HasValue ? ", due " + t.DueDate.Value.ToString("MMM d") : "")}]")));
                }

                var notifications = await _notificationRepo.FindAsync(
                    n => n.UserId == userId && !n.IsRead);
                var recentNotifications = notifications
                    .OrderByDescending(n => n.CreatedAt)
                    .Take(5)
                    .ToList();
                if (recentNotifications.Any())
                {
                    sb.Append("\n\nRecent unread notifications: ");
                    sb.Append(string.Join("; ", recentNotifications.Select(n => $"{n.Title}: {n.Message}")));
                }
            }
            catch
            {
                // Context injection is best-effort; return the base prompt if data access fails
            }

            return sb.ToString();
        }
    }
}
