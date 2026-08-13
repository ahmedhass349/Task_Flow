using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using taskflow.Data.Entities;
using taskflow.DTOs.Dashboard;
using taskflow.Repositories.Interfaces;
using taskflow.Services.Interfaces;
using TaskStatus = taskflow.Data.Entities.TaskStatus;

namespace taskflow.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly ITaskRepository _taskRepository;
        private readonly IProjectRepository _projectRepository;
        private readonly IGenericRepository<TeamMember> _teamMemberRepository;

        public DashboardService(
            ITaskRepository taskRepository,
            IProjectRepository projectRepository,
            IGenericRepository<TeamMember> teamMemberRepository)
        {
            _taskRepository = taskRepository;
            _projectRepository = projectRepository;
            _teamMemberRepository = teamMemberRepository;
        }

        public async Task<DashboardStatsDto> GetStatsAsync(int userId)
        {
            var activeTaskCountTask = _taskRepository.CountAsync(
                t => t.AssigneeId == userId && t.Status != TaskStatus.Completed);

            var inProgressCountTask = _taskRepository.CountAsync(
                t => t.AssigneeId == userId && t.Status == TaskStatus.InProgress);

            var projectsTask = _projectRepository.GetUserProjectsAsync(userId);

            var userTeamIdsTask = _teamMemberRepository.Query()
                .Where(tm => tm.UserId == userId)
                .Select(tm => tm.TeamId)
                .Distinct()
                .ToListAsync();

            await Task.WhenAll(activeTaskCountTask, inProgressCountTask, projectsTask, userTeamIdsTask);

            int activeTaskCount = activeTaskCountTask.Result;
            int inProgressCount = inProgressCountTask.Result;
            int projectCount = projectsTask.Result.Count();
            var userTeamIds = userTeamIdsTask.Result;

            int teamMemberCount = userTeamIds.Count > 0
                ? await _teamMemberRepository.CountAsync(tm => userTeamIds.Contains(tm.TeamId))
                : 0;

            return new DashboardStatsDto
            {
                ActiveTaskCount = activeTaskCount,
                InProgressCount = inProgressCount,
                ProjectCount = projectCount,
                TeamMemberCount = teamMemberCount
            };
        }

        public async Task<IEnumerable<ActivityItemDto>> GetRecentActivityAsync(int userId)
        {
            var recentTasks = await _taskRepository.Query()
                .Include(t => t.Assignee)
                .Where(t => t.AssigneeId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .Take(10)
                .ToListAsync();

            var activityItems = recentTasks.Select(t => new ActivityItemDto
            {
                Id = t.Id,
                Description = $"Task \"{t.Title}\" — {t.Status}",
                UserName = t.Assignee?.FullName ?? string.Empty,
                CreatedAt = t.CreatedAt
            });

            return activityItems;
        }
    }
}
