using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using taskflow.Data.Entities;
using taskflow.DTOs.Teams;
using taskflow.Repositories.Interfaces;
using taskflow.Services.Interfaces;
using TaskStatus = taskflow.Data.Entities.TaskStatus;

namespace taskflow.Services
{
    public class TeamService : ITeamService
    {
        private readonly IGenericRepository<Team> _teamRepository;
        private readonly IGenericRepository<TeamMember> _teamMemberRepository;
        private readonly IUserRepository _userRepository;
        private readonly ITaskRepository _taskRepository;
        private readonly IMapper _mapper;
        private readonly IMirrorService _mirror;
        private readonly INotificationService _notificationService;

        public TeamService(
            IGenericRepository<Team> teamRepository,
            IGenericRepository<TeamMember> teamMemberRepository,
            IUserRepository userRepository,
            ITaskRepository taskRepository,
            IMapper mapper,
            IMirrorService mirror,
            INotificationService notificationService)
        {
            _teamRepository = teamRepository;
            _teamMemberRepository = teamMemberRepository;
            _userRepository = userRepository;
            _taskRepository = taskRepository;
            _mapper = mapper;
            _mirror = mirror;
            _notificationService = notificationService;
        }

        public async Task<IEnumerable<TeamDto>> GetUserTeamsAsync(int userId)
        {
            var teams = await _teamRepository.Query()
                .Include(t => t.Owner)
                .Include(t => t.Members)
                .Where(t => t.OwnerId == userId || t.Members.Any(m => m.UserId == userId))
                .ToListAsync();

            return _mapper.Map<IEnumerable<TeamDto>>(teams);
        }

        public async Task<TeamDto> CreateTeamAsync(int userId, CreateTeamRequest request)
        {
            var team = new Team
            {
                Name = request.Name,
                Description = request.Description,
                OwnerId = userId,
                CreatedAt = DateTime.UtcNow
            };

            await _teamRepository.AddAsync(team);
            await _teamRepository.SaveChangesAsync();
            _mirror.Mirror("teams", team.Id, team);

            // Fix #14: Use single SaveChangesAsync instead of two
            var ownerMember = new TeamMember
            {
                TeamId = team.Id,
                UserId = userId,
                Role = TeamRole.Leader
            };

            await _teamMemberRepository.AddAsync(ownerMember);
            await _teamMemberRepository.SaveChangesAsync();

            var savedTeam = await _teamRepository.Query()
                .Include(t => t.Owner)
                .Include(t => t.Members)
                .FirstOrDefaultAsync(t => t.Id == team.Id);

            return _mapper.Map<TeamDto>(savedTeam!);
        }

        public async Task<TeamDto> UpdateTeamAsync(int userId, int teamId, UpdateTeamRequest request)
        {
            var team = await _teamRepository.GetByIdAsync(teamId);
            if (team == null)
                throw new KeyNotFoundException($"Team with ID {teamId} not found.");

            // Only owner can update
            if (team.OwnerId != userId)
                throw new UnauthorizedAccessException("You do not have permission to update this team.");

            team.Name = request.Name;
            if (request.Description != null)
                team.Description = request.Description;

            _teamRepository.Update(team);
            await _teamRepository.SaveChangesAsync();
            _mirror.Mirror("teams", team.Id, team);

            var saved = await _teamRepository.Query()
                .Include(t => t.Owner)
                .Include(t => t.Members)
                .FirstOrDefaultAsync(t => t.Id == team.Id);

            return _mapper.Map<TeamDto>(saved!);
        }

        public async Task DeleteTeamAsync(int userId, int teamId)
        {
            var team = await _teamRepository.Query()
                .Include(t => t.Members)
                .FirstOrDefaultAsync(t => t.Id == teamId);

            if (team == null)
                throw new KeyNotFoundException($"Team with ID {teamId} not found.");

            // Only owner can delete
            if (team.OwnerId != userId)
                throw new UnauthorizedAccessException("You do not have permission to delete this team.");

            // Notify all non-owner members before removing them
            var memberIdsToNotify = team.Members
                .Where(m => m.UserId != userId)
                .Select(m => m.UserId)
                .ToList();

            // Remove all members first; mirror each deletion to MongoDB
            foreach (var member in team.Members.ToList())
            {
                _teamMemberRepository.Remove(member);
                _mirror.Erase("team_member_records", member.TeamId * 1_000_000 + member.UserId);
            }

            _teamRepository.Remove(team);
            await _teamRepository.SaveChangesAsync();
            _mirror.Erase("teams", teamId);

            // Send notifications after successful delete (fire-and-forget per member)
            foreach (var memberId in memberIdsToNotify)
            {
                try { await _notificationService.NotifyTeamDeletedAsync(memberId, team.Name); }
                catch { /* Don't fail the delete if a notification fails */ }
            }
        }

        public async Task<IEnumerable<TeamMemberDto>> GetTeamMembersAsync(int teamId)
        {
            var team = await _teamRepository.Query()
                .Include(t => t.Members)
                    .ThenInclude(m => m.User)
                .FirstOrDefaultAsync(t => t.Id == teamId);

            if (team == null)
                throw new KeyNotFoundException($"Team with ID {teamId} not found.");

            // PHASE 5: Batch-load all four task status counts in one pass
            var memberUserIds = team.Members.Select(m => m.UserId).ToList();

            var completedCounts = await _taskRepository.Query()
                .Where(t => t.AssigneeId.HasValue && memberUserIds.Contains(t.AssigneeId.Value) && t.Status == TaskStatus.Completed)
                .GroupBy(t => t.AssigneeId!.Value)
                .Select(g => new { UserId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.UserId, x => x.Count);

            var inProgressCounts = await _taskRepository.Query()
                .Where(t => t.AssigneeId.HasValue && memberUserIds.Contains(t.AssigneeId.Value) && t.Status == TaskStatus.InProgress)
                .GroupBy(t => t.AssigneeId!.Value)
                .Select(g => new { UserId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.UserId, x => x.Count);

            var todoCounts = await _taskRepository.Query()
                .Where(t => t.AssigneeId.HasValue && memberUserIds.Contains(t.AssigneeId.Value) && t.Status == TaskStatus.Todo)
                .GroupBy(t => t.AssigneeId!.Value)
                .Select(g => new { UserId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.UserId, x => x.Count);

            var overdueCounts = await _taskRepository.Query()
                .Where(t => t.AssigneeId.HasValue && memberUserIds.Contains(t.AssigneeId.Value) && t.Status == TaskStatus.Overdue)
                .GroupBy(t => t.AssigneeId!.Value)
                .Select(g => new { UserId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.UserId, x => x.Count);

            var result = new List<TeamMemberDto>();
            foreach (var member in team.Members)
            {
                // Compute initials (#30)
                var nameParts = (member.User?.FullName ?? "").Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
                string initials = nameParts.Length >= 2
                    ? $"{nameParts[0][0]}{nameParts[^1][0]}".ToUpperInvariant()
                    : nameParts.Length == 1 ? nameParts[0][0].ToString().ToUpperInvariant() : "?";

                completedCounts.TryGetValue(member.UserId, out int completedCount);
                inProgressCounts.TryGetValue(member.UserId, out int inProgressCount);
                todoCounts.TryGetValue(member.UserId, out int todoCount);
                overdueCounts.TryGetValue(member.UserId, out int overdueCount);

                result.Add(new TeamMemberDto
                {
                    UserId = member.UserId,
                    UserName = member.User?.FullName ?? string.Empty,
                    Email = member.User?.Email ?? string.Empty,
                    AvatarUrl = member.User?.AvatarUrl,
                    Initials = initials,
                    Role = member.Role.ToString(),
                    TasksCompleted = completedCount,
                    TasksInProgress = inProgressCount,
                    TasksTodo = todoCount,
                    TasksOverdue = overdueCount,
                });
            }

            return result;
        }

        public async Task AddTeamMemberAsync(int teamId, AddTeamMemberRequest request)
        {
            var team = await _teamRepository.GetByIdAsync(teamId);
            if (team == null)
                throw new KeyNotFoundException($"Team with ID {teamId} not found.");

            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null)
                throw new KeyNotFoundException($"User with email '{request.Email}' not found.");

            bool alreadyMember = await _teamMemberRepository.ExistsAsync(
                tm => tm.TeamId == teamId && tm.UserId == user.Id);

            if (alreadyMember)
                throw new InvalidOperationException("User is already a member of this team.");

            var teamMember = new TeamMember
            {
                TeamId = teamId,
                UserId = user.Id,
                Role = request.Role
            };

            await _teamMemberRepository.AddAsync(teamMember);
            await _teamMemberRepository.SaveChangesAsync();

            // Mirror the addition to MongoDB immediately so team_member_records
            // stays consistent across machines without waiting for the next BulkSync.
            // Synthetic id matches the BulkSync formula: TeamId * 1_000_000 + UserId.
            _mirror.Mirror("team_member_records", teamMember.TeamId * 1_000_000 + teamMember.UserId, teamMember);
        }

        public async Task RemoveTeamMemberAsync(int userId, int teamId, int memberUserId)
        {
            var team = await _teamRepository.GetByIdAsync(teamId);
            if (team == null)
                throw new KeyNotFoundException($"Team with ID {teamId} not found.");

            // Only owner can remove members
            if (team.OwnerId != userId)
                throw new UnauthorizedAccessException("You do not have permission to remove members from this team.");

            var membership = await _teamMemberRepository.FirstOrDefaultAsync(
                tm => tm.TeamId == teamId && tm.UserId == memberUserId);

            if (membership == null)
                throw new KeyNotFoundException($"User with ID {memberUserId} is not a member of this team.");

            // Cannot remove the owner
            if (memberUserId == team.OwnerId)
                throw new InvalidOperationException("Cannot remove the team owner.");

            _teamMemberRepository.Remove(membership);
            await _teamMemberRepository.SaveChangesAsync();

            // Mirror the deletion to MongoDB so team_member_records stays consistent
            // across all machines (BulkSync uses a synthetic id = TeamId * 1_000_000 + UserId)
            _mirror.Erase("team_member_records", membership.TeamId * 1_000_000 + membership.UserId);
        }
    }
}
