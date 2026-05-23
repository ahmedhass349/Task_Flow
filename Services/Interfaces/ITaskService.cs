using System.Collections.Generic;
using System.Threading.Tasks;
using taskflow.DTOs.Tasks;

namespace taskflow.Services.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskDto>> GetTasksAsync(int userId, TaskFilterRequest filter);
        Task<TaskDto> GetTaskByIdAsync(int userId, int taskId);
        Task<TaskDto> CreateTaskAsync(int userId, CreateTaskRequest request);
        /// <summary>PHASE 3: Assign a task to a team member by email on behalf of a leader.</summary>
        Task<TaskDto> AssignTaskAsync(int assignerUserId, AssignTaskRequest request);
        Task<TaskDto> UpdateTaskAsync(int userId, int taskId, UpdateTaskRequest request);
        Task DeleteTaskAsync(int userId, int taskId);
        Task<TaskDto> ToggleStarAsync(int userId, int taskId);
        Task<TaskDto> UpdateStatusAsync(int userId, int taskId, string status);
    }
}
