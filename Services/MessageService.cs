using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using taskflow.Data.Entities;
using taskflow.DTOs.Messages;
using taskflow.Repositories.Interfaces;
using taskflow.Services.Interfaces;

namespace taskflow.Services
{
    public class MessageService : IMessageService
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMirrorService _mirror;
        private readonly INotificationService _notificationService;
        private readonly IMongoService _mongo;

        public MessageService(
            IMessageRepository messageRepository,
            IUserRepository userRepository,
            IMirrorService mirror,
            INotificationService notificationService,
            IMongoService mongo)
        {
            _messageRepository = messageRepository;
            _userRepository = userRepository;
            _mirror = mirror;
            _notificationService = notificationService;
            _mongo = mongo;
        }

        public async Task<IEnumerable<ContactDto>> GetContactsAsync(int userId)
        {
            var contacts = await _messageRepository.GetContactsAsync(userId);
            var contactList = contacts.ToList();

            // Fix #11: Batch-load all messages instead of N+1
            var contactIds = contactList.Select(c => c.Id).ToList();
            var allMessages = await _messageRepository.Query()
                .Where(m => (m.SenderId == userId && contactIds.Contains(m.ReceiverId)) ||
                            (m.ReceiverId == userId && contactIds.Contains(m.SenderId)))
                .Where(m => !(m.SenderId == userId && m.IsDeletedBySender) &&
                            !(m.ReceiverId == userId && m.IsDeletedByReceiver))
                .OrderByDescending(m => m.SentAt)
                .ToListAsync();

            var result = new List<ContactDto>();

            // A-02: batch-fetch presence data so we can show real last-seen per contact
            var emails = contactList.Select(c => c.Email).Where(e => !string.IsNullOrEmpty(e)).ToList();
            var lastSeenMap = await _mongo.GetLastSeenBatchAsync(emails);

            foreach (var contact in contactList)
            {
                var contactMessages = allMessages
                    .Where(m => (m.SenderId == userId && m.ReceiverId == contact.Id) ||
                                (m.ReceiverId == userId && m.SenderId == contact.Id))
                    .ToList();

                var lastMessage = contactMessages.FirstOrDefault();
                int unreadCount = contactMessages.Count(m => m.ReceiverId == userId && !m.IsRead);

                // Compute initials from name (#29)
                var nameParts = (contact.FullName ?? "").Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
                string initials = nameParts.Length >= 2
                    ? $"{nameParts[0][0]}{nameParts[^1][0]}".ToUpperInvariant()
                    : nameParts.Length == 1 ? nameParts[0][0].ToString().ToUpperInvariant() : "?";

                result.Add(new ContactDto
                {
                    Id = contact.Id,
                    Name = contact.FullName ?? string.Empty,
                    AvatarUrl = contact.AvatarUrl,
                    Initials = initials,
                    IsStarred = false,
                    LastMessage = lastMessage?.Body ?? string.Empty,
                    LastMessageTime = lastMessage?.SentAt ?? DateTime.MinValue,
                    UnreadCount = unreadCount,
                    // A-02: map presence heartbeat; null when user has never logged in on a connected device
                    LastSeen = lastSeenMap.TryGetValue(contact.Email ?? "", out var ls) ? ls : null,
                });
            }

            return result.OrderByDescending(c => c.LastMessageTime);
        }

        public async Task<IEnumerable<MessageDto>> GetConversationAsync(int userId, int contactId)
        {
            var messages = await _messageRepository.GetConversationAsync(userId, contactId);

            return messages.Select(m => new MessageDto
            {
                Id = m.Id,
                SenderId = m.SenderId,
                SenderName = m.Sender?.FullName ?? string.Empty,
                ReceiverId = m.ReceiverId,
                Body = m.Body,
                IsRead = m.IsRead,
                IsSystemMessage = m.IsSystemMessage,
                SentAt = m.SentAt,
                AttachmentUrl = m.AttachmentUrl,
                AttachmentName = m.AttachmentName,
                AttachmentType = m.AttachmentType,
                AttachmentSize = m.AttachmentSize
            }).OrderBy(m => m.SentAt);
        }

        public async Task<MessageDto> SendMessageAsync(int userId, SendMessageRequest request)
        {
            var sender = await _userRepository.GetByIdAsync(userId);
            if (sender == null)
                throw new KeyNotFoundException("Sender not found.");

            var receiver = await _userRepository.GetByIdAsync(request.ReceiverId);
            if (receiver == null)
                throw new KeyNotFoundException($"Receiver with ID {request.ReceiverId} not found.");

            var message = new Message
            {
                SenderId = userId,
                ReceiverId = request.ReceiverId,
                Body = request.Body,
                IsRead = false,
                SentAt = DateTime.UtcNow,
                AttachmentUrl = request.AttachmentUrl,
                AttachmentName = request.AttachmentName,
                AttachmentType = request.AttachmentType,
                AttachmentSize = request.AttachmentSize
            };

            await _messageRepository.AddAsync(message);
            await _messageRepository.SaveChangesAsync();
            _mirror.Mirror("messages", message.Id, message);

            // Notify the receiver via SignalR (they'll see it in real-time)
            try { await _notificationService.NotifyMessageReceivedAsync(request.ReceiverId, sender.FullName, request.Body ?? ""); }
            catch { /* Don't fail the send if notification fails */ }

            return new MessageDto
            {
                Id = message.Id,
                SenderId = message.SenderId,
                SenderName = sender.FullName,
                ReceiverId = message.ReceiverId,
                Body = message.Body,
                IsRead = message.IsRead,
                IsSystemMessage = message.IsSystemMessage,
                SentAt = message.SentAt,
                AttachmentUrl = message.AttachmentUrl,
                AttachmentName = message.AttachmentName,
                AttachmentType = message.AttachmentType,
                AttachmentSize = message.AttachmentSize
            };
        }

        public Task MarkConversationAsReadAsync(int userId, int contactId)
            => _messageRepository.MarkConversationAsReadAsync(userId, contactId);

        public Task MarkAllAsReadAsync(int userId)
            => _messageRepository.MarkAllAsReadAsync(userId);

        public async Task DeleteConversationAsync(int userId, int contactId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            string fullName = user?.FullName ?? "Someone";
            await _messageRepository.DeleteConversationAsync(userId, contactId, fullName);
        }

        public Task DeleteMessageAsync(int messageId, int userId)
            => _messageRepository.DeleteMessageAsync(messageId, userId);

        public async Task<ContactDto?> ResolveContactAsync(int requestingUserId, string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null || user.Id == requestingUserId)
                return null;

            var nameParts = (user.FullName ?? "").Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            string initials = nameParts.Length >= 2
                ? $"{nameParts[0][0]}{nameParts[^1][0]}".ToUpperInvariant()
                : nameParts.Length == 1 ? nameParts[0][0].ToString().ToUpperInvariant() : "?";

            // A-02: resolve presence for the single contact
            var singlePresence = await _mongo.GetLastSeenBatchAsync(new[] { user.Email! });
            singlePresence.TryGetValue(user.Email!, out var singleLastSeen);

            return new ContactDto
            {
                Id = user.Id,
                Name = user.FullName ?? string.Empty,
                Initials = initials,
                AvatarUrl = user.AvatarUrl,
                LastMessage = string.Empty,
                LastMessageTime = System.DateTime.MinValue,
                UnreadCount = 0,
                IsStarred = false,
                LastSeen = singleLastSeen == default ? null : singleLastSeen,
            };
        }
    }
}
