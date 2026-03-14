using System.Collections.Generic;
using System.Threading.Tasks;
using taskflow.DTOs.Dashboard;

namespace taskflow.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardStatsDto> GetStatsAsync(int userId);
        Task<IEnumerable<ActivityItemDto>> GetRecentActivityAsync(int userId);
    }
}
