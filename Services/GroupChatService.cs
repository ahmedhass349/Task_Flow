using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using taskflow.Data.Entities;
using taskflow.DTOs.GroupChats;
using taskflow.Repositories.Interfaces;
using taskflow.Services.Interfaces;

namespace taskflow.Services
{
    public class GroupChatService : IGroupChatService
    {
        private readonly IGroupChatRepository _repo;
        private readonly IUserRepository _userRepo;
        private readonly INotificationService _notificationService;

        public GroupChatService(
            IGroupChatRepository repo,
            IUserRepository userRepo,
            INotificationService notificationService)
        {
            _repo = repo;
            _userRepo = userRepo;
            _notificationService = notificationService;
        }

        public async Task<List<GroupChatDto>> GetUserGroupChatsAsync(int userId)
        {
            var groups = await _repo.GetUserGroupChatsAsync(userId);
            var result = new List<GroupChatDto>();

            foreach (var g in groups)
            {
                var unread = await _repo.GetUnreadCountAsync(g.Id, userId);
                var lastMsg = await _repo.GetLastMessageAsync(g.Id);
                result.Add(MapToDto(g, unread, lastMsg));
            }

            return result;
        }

        public async Task<GroupChatDto> CreateGroupChatAsync(int creatorUserId, CreateGroupChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ArgumentException("Group name is required.");

            if (request.MemberEmails == null || request.MemberEmails.Count == 0)
                throw new ArgumentException("At least one other member is required.");

            var members = new List<GroupChatMember>
            {
                new GroupChatMember { UserId = creatorUserId }
            };

            foreach (var email in request.MemberEmails.Distinct())
            {
                var u = await _userRepo.GetByEmailAsync(email);
                if (u != null && u.Id != creatorUserId)
                    members.Add(new GroupChatMember { UserId = u.Id });
            }

            var groupChat = new GroupChat
            {
                Name = request.Name.Trim(),
                CreatedByUserId = creatorUserId,
                Members = members,
            };

            await _repo.CreateAsync(groupChat);

            // Notify members about the new group
            var creator = await _userRepo.GetByIdAsync(creatorUserId);
            var creatorName = creator?.FullName ?? "Someone";
            foreach (var member in members)
            {
                if (member.UserId == creatorUserId) continue;
                try
                {
                    await _notificationService.CreateAsync(
                        member.UserId,
                        "Added to a Group",
                        $"{creatorName} added you to the group \"{groupChat.Name}\".",
                        NotificationType.MessageReceived,
                        NotificationPriority.Medium,
                        actionUrl: "/messages");
                }
                catch { /* non-critical */ }
            }

            // Reload with navigation props
            var loaded = await _repo.GetByIdAsync(groupChat.Id);
            return MapToDto(loaded!, 0, null);
        }

        public async Task<List<GroupMessageDto>> GetGroupMessagesAsync(int groupChatId, int requestingUserId)
        {
            if (!await _repo.IsMemberAsync(groupChatId, requestingUserId))
                throw new UnauthorizedAccessException("You are not a member of this group.");

            var messages = await _repo.GetMessagesAsync(groupChatId);
            return messages.Select(MapMessageToDto).ToList();
        }

        public async Task<GroupMessageDto> SendGroupMessageAsync(int groupChatId, int senderUserId, SendGroupMessageRequest request)
        {
            if (!await _repo.IsMemberAsync(groupChatId, senderUserId))
                throw new UnauthorizedAccessException("You are not a member of this group.");

            if (string.IsNullOrWhiteSpace(request.Body) && string.IsNullOrWhiteSpace(request.AttachmentUrl))
                throw new ArgumentException("Message body or attachment is required.");

            var message = new GroupMessage
            {
                GroupChatId = groupChatId,
                SenderId = senderUserId,
                Body = request.Body?.Trim() ?? string.Empty,
                AttachmentUrl = request.AttachmentUrl,
                AttachmentName = request.AttachmentName,
                AttachmentType = request.AttachmentType,
                AttachmentSize = request.AttachmentSize,
            };

            await _repo.AddMessageAsync(message);

            // Mark as read for sender
            await _repo.UpdateLastReadAsync(groupChatId, senderUserId, message.SentAt);

            // Notify other group members
            var group = await _repo.GetByIdAsync(groupChatId);
            if (group != null)
            {
                var sender = group.Members.FirstOrDefault(m => m.UserId == senderUserId)?.User;
                var senderName = sender?.FullName ?? "Someone";
                var preview = message.Body.Length > 60 ? message.Body[..57] + "…" : message.Body;
                if (string.IsNullOrEmpty(preview) && !string.IsNullOrEmpty(message.AttachmentName))
                    preview = message.AttachmentName;

                foreach (var member in group.Members)
                {
                    if (member.UserId == senderUserId) continue;
                    try
                    {
                        await _notificationService.CreateAsync(
                            member.UserId,
                            $"{group.Name}",
                            $"{senderName}: {preview}",
                            NotificationType.MessageReceived,
                            NotificationPriority.Medium,
                            actionUrl: "/messages");
                    }
                    catch { /* non-critical */ }
                }
            }

            // Load sender info for the DTO
            var senderUser = await _userRepo.GetByIdAsync(senderUserId);
            message.Sender = senderUser!;
            return MapMessageToDto(message);
        }

        public async Task MarkGroupAsReadAsync(int groupChatId, int userId)
        {
            if (!await _repo.IsMemberAsync(groupChatId, userId))
                return;
            await _repo.UpdateLastReadAsync(groupChatId, userId, DateTime.UtcNow);
        }

        public async Task LeaveGroupAsync(int groupChatId, int userId)
        {
            if (!await _repo.IsMemberAsync(groupChatId, userId))
                throw new KeyNotFoundException("Group membership not found.");
            await _repo.LeaveGroupAsync(groupChatId, userId);
        }

        // ── Mapping helpers ───────────────────────────────────────────────────

        private static GroupChatDto MapToDto(GroupChat g, int unread, GroupMessage? lastMsg) => new()
        {
            Id = g.Id,
            Name = g.Name,
            CreatedByUserId = g.CreatedByUserId,
            CreatedByName = g.CreatedBy?.FullName ?? string.Empty,
            CreatedAt = g.CreatedAt,
            Members = g.Members.Select(m => new GroupChatMemberDto
            {
                UserId = m.UserId,
                FullName = m.User?.FullName ?? string.Empty,
                AvatarUrl = m.User?.AvatarUrl,
                JoinedAt = m.JoinedAt,
            }).ToList(),
            LastMessage = lastMsg != null ? MapMessageToDto(lastMsg) : null,
            UnreadCount = unread,
        };

        private static GroupMessageDto MapMessageToDto(GroupMessage m) => new()
        {
            Id = m.Id,
            GroupChatId = m.GroupChatId,
            SenderId = m.SenderId,
            SenderName = m.Sender?.FullName ?? string.Empty,
            SenderAvatarUrl = m.Sender?.AvatarUrl,
            Body = m.Body,
            SentAt = m.SentAt,
            AttachmentUrl = m.AttachmentUrl,
            AttachmentName = m.AttachmentName,
            AttachmentType = m.AttachmentType,
            AttachmentSize = m.AttachmentSize,
        };
    }
}
