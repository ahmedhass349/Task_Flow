using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using taskflow.Data;
using taskflow.Data.Entities;
using taskflow.Repositories.Interfaces;

namespace taskflow.Repositories
{
    public class ProjectRepository : GenericRepository<Project>, IProjectRepository
    {
        public ProjectRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Project>> GetUserProjectsAsync(int userId)
        {
            return await _dbSet
                .Include(p => p.Owner)
                .Include(p => p.Members)
                    .ThenInclude(pm => pm.User)
                .Where(p => p.OwnerId == userId
                         || p.Members.Any(m => m.UserId == userId))
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<Project?> GetProjectWithDetailsAsync(int projectId)
        {
            return await _dbSet
                .Include(p => p.Owner)
                .Include(p => p.Members)
                    .ThenInclude(pm => pm.User)
                .Include(p => p.Tasks)
                    .ThenInclude(t => t.Assignee)
                .FirstOrDefaultAsync(p => p.Id == projectId);
        }
    }
}
