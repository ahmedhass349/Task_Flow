using System.Collections.Generic;
using System.Threading.Tasks;
using taskflow.DTOs.Tasks;

namespace taskflow.Services.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskDto>> GetTasksAsync(int userId, TaskFilterRequest filter);
        Task<IEnumerable<TaskDto>> GetTasksByMemberIdAsync(int memberId);
        Task<IEnumerable<TaskDto>> GetTasksByMemberEmailAsync(string email);
        Task<MemberMetricsDto> GetMemberMetricsAsync(string email);
        Task<TaskDto> GetTaskByIdAsync(int userId, int taskId);
        Task<TaskDto> CreateTaskAsync(int userId, CreateTaskRequest request);
        Task<TaskDto> UpdateTaskAsync(int userId, int taskId, UpdateTaskRequest request);
        Task DeleteTaskAsync(int userId, int taskId);
        Task<TaskDto> ToggleStarAsync(int userId, int taskId);
        Task<TaskDto> UpdateStatusAsync(int userId, int taskId, string status);
    }
}
