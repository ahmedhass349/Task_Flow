using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using taskflow.DTOs.Mongo;
using taskflow.Models.Mongo;

namespace taskflow.Services.Interfaces
{
    public interface IMongoService
    {
        // FILE: Services/Interfaces/IMongoService.cs  PHASE: 1  CHANGE: added PingAsync
        Task<bool> PingAsync(CancellationToken ct = default);

        // ── Presence ──────────────────────────────────────────────────────────
        Task UpsertPresenceAsync(string email, string fullName, string avatarUrl);
        Task<List<UserSearchResultDto>> SearchUsersAsync(string query, string excludeEmail);

        // ── Invitations ───────────────────────────────────────────────────────
        Task<TeamInvitation> SendInvitationAsync(
            string senderUserId, string senderEmail, string senderFullName, string senderAvatarUrl,
            SendInvitationRequestDto request);

        Task<List<InvitationResponseDto>> GetIncomingInvitationsAsync(string recipientEmail);
        Task<List<InvitationResponseDto>> GetOutgoingInvitationsAsync(string senderEmail);

        Task<TeamInvitation> AcceptInvitationAsync(string invitationId, string recipientEmail);
        Task<TeamInvitation> DeclineInvitationAsync(string invitationId, string recipientEmail, string? reason);
        Task CancelInvitationAsync(string invitationId, string senderEmail);

        // ── Team members (cross-device) ───────────────────────────────────────
        Task<List<MongoTeamMemberDto>> GetTeamMembersAsync(string teamId, string ownerEmail);
        Task<List<MongoTeamMemberDto>> GetAllTeamMembersAsync(string ownerEmail);
        Task RemoveTeamMemberAsync(string teamId, string memberEmail, string ownerEmail);
        Task RemoveAllMemberRecordsAsync(string memberEmail, string ownerEmail);
        Task<MongoTeamMemberDto> AddMemberToTeamAsync(string ownerEmail, string memberEmail, string memberFullName, string targetTeamId, string targetTeamName, string role = "Member");
        Task DeleteInvitationAsync(string invitationId, string ownerEmail);
        Task<List<MongoTeamMemberDto>> DeleteTeamMembersAsync(string teamId);

        // ── Cross-member queries ──────────────────────────────────────────────
        Task<List<MongoTeamMemberDto>> GetMembershipsByUserAsync(string userEmail);
        Task LeaveTeamAsync(string teamId, string userEmail);

        // ── Account lifecycle ─────────────────────────────────────────────────
        Task DeleteUserDataAsync(string userEmail);

        // ── Dev / testing ─────────────────────────────────────────────────────
        Task ClearAllAsync();
    }
}
