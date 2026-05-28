using System.Collections.Generic;
using System.Threading.Tasks;
using taskflow.Data.Entities;

namespace taskflow.Repositories.Interfaces
{
    public interface ITaskCommentRepository : IGenericRepository<TaskComment>
    {
        Task<IEnumerable<TaskComment>> GetByTaskIdAsync(int taskId);
        Task<TaskComment?> GetByIdWithAuthorAsync(int commentId);
    }
}
