using System.Collections.Generic;
using System.Threading.Tasks;
using taskflow.DTOs.Teams;

namespace taskflow.Services.Interfaces
{
    public interface ITeamService
    {
        Task<IEnumerable<TeamDto>> GetUserTeamsAsync(int userId);
        Task<TeamDto> CreateTeamAsync(int userId, CreateTeamRequest request);
        Task<TeamDto> UpdateTeamAsync(int userId, int teamId, UpdateTeamRequest request);
        Task DeleteTeamAsync(int userId, int teamId);
        Task<IEnumerable<TeamMemberDto>> GetTeamMembersAsync(int teamId);
        Task AddTeamMemberAsync(int teamId, AddTeamMemberRequest request);
        Task RemoveTeamMemberAsync(int userId, int teamId, int memberUserId);
    }
}
