using System.Threading.Tasks;
using taskflow.DTOs.Notifications;

namespace taskflow.Services.Interfaces
{
    public interface IReminderService
    {
        Task SaveRemindersAsync(CreateReminderDto dto, int userId);
        Task ProcessPendingRemindersAsync();
        Task DeleteRemindersForTaskAsync(int taskId);
    }
}
