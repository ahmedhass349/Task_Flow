using System.Collections.Generic;
using System.Threading.Tasks;
using taskflow.Data.Entities;

namespace taskflow.Repositories.Interfaces
{
    public interface IProjectRepository : IGenericRepository<Project>
    {
        Task<IEnumerable<Project>> GetUserProjectsAsync(int userId);
        Task<Project?> GetProjectWithDetailsAsync(int projectId);
    }
}
