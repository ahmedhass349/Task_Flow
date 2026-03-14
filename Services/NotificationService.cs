// FILE: Services/NotificationService.cs
// STATUS: UPDATED
// CHANGES: Added userId ownership check to MarkAsReadAsync (#2)

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using taskflow.DTOs.Notifications;
using taskflow.Repositories.Interfaces;
using taskflow.Services.Interfaces;

namespace taskflow.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IMapper _mapper;

        public NotificationService(INotificationRepository notificationRepository, IMapper mapper)
        {
            _notificationRepository = notificationRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<NotificationDto>> GetNotificationsAsync(int userId)
        {
            var notifications = await _notificationRepository.GetUserNotificationsAsync(userId);
            return _mapper.Map<IEnumerable<NotificationDto>>(notifications);
        }

        public async Task MarkAsReadAsync(int userId, int notificationId)
        {
            var notification = await _notificationRepository.GetByIdAsync(notificationId);
            if (notification == null)
                throw new KeyNotFoundException($"Notification with ID {notificationId} not found.");

            // Ownership check (#2)
            if (notification.UserId != userId)
                throw new UnauthorizedAccessException("You do not have permission to modify this notification.");

            notification.IsRead = true;

            _notificationRepository.Update(notification);
            await _notificationRepository.SaveChangesAsync();
        }

        public async Task MarkAllAsReadAsync(int userId)
        {
            var notifications = await _notificationRepository.GetUserNotificationsAsync(userId);
            var unreadNotifications = notifications.Where(n => !n.IsRead).ToList();

            foreach (var notification in unreadNotifications)
            {
                notification.IsRead = true;
                _notificationRepository.Update(notification);
            }

            await _notificationRepository.SaveChangesAsync();
        }
    }
}
