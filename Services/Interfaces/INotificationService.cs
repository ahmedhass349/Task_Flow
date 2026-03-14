using System.Collections.Generic;
using System.Threading.Tasks;
using taskflow.DTOs.Notifications;

namespace taskflow.Services.Interfaces
{
    public interface INotificationService
    {
        Task<IEnumerable<NotificationDto>> GetNotificationsAsync(int userId);
        Task MarkAsReadAsync(int userId, int notificationId);
        Task MarkAllAsReadAsync(int userId);
    }
}
