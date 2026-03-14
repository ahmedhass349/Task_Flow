using System.Collections.Generic;
using System.Threading.Tasks;
using taskflow.Data.Entities;

namespace taskflow.Repositories.Interfaces
{
    public interface INotificationRepository : IGenericRepository<Notification>
    {
        Task<IEnumerable<Notification>> GetUserNotificationsAsync(int userId);
    }
}
