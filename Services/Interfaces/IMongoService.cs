using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using taskflow.DTOs.Mongo;
using taskflow.Models.Mongo;

namespace taskflow.Services.Interfaces
{
    public interface IMongoService
    {
        Task<bool> PingAsync(CancellationToken ct = default);

        // ── Presence ──────────────────────────────────────────────────────────
        Task UpsertPresenceAsync(string email, string fullName, string avatarUrl);
        Task<List<UserSearchResultDto>> SearchUsersAsync(string query, string excludeEmail);
        // A-02: batch-fetch last-seen timestamps from user_presence by email list
        Task<Dictionary<string, DateTime>> GetLastSeenBatchAsync(IEnumerable<string> emails);

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

        // ── Credential backup / restoration ───────────────────────────────────

        /// <summary>
        /// Saves (or updates) the BCrypt credential record for <paramref name="email"/>
        /// in the private <c>user_accounts</c> collection.
        /// Call after successful register and after every password reset.
        /// </summary>
        Task BackupUserAccountAsync(string email, string passwordHash, int sqliteId);

        /// <summary>
        /// Returns the stored <see cref="UserAccount"/> for <paramref name="email"/>,
        /// or <c>null</c> when no backup exists or MongoDB is unreachable.
        /// </summary>
        Task<UserAccount?> FindAccountForRestorationAsync(string email);

        // ── Cross-machine notification bus ────────────────────────────────────

        /// <summary>Writes a pending notification into MongoDB for a user on a different machine.</summary>
        Task WriteCrossNotificationAsync(CrossNotification notification);

        /// <summary>
        /// Returns all pending cross-notifications for <paramref name="recipientEmail"/>
        /// and atomically deletes them (deliver-once semantics).
        /// </summary>
        Task<List<CrossNotification>> PullAndDeleteCrossNotificationsAsync(string recipientEmail);

        // ── Announcements (Phase 2) ───────────────────────────────────────────

        /// <summary>Persists a new announcement to MongoDB and returns it with its generated Id.</summary>
        Task<TeamAnnouncement> WriteAnnouncementAsync(TeamAnnouncement announcement);

        /// <summary>Returns the <paramref name="limit"/> most recent announcements for a team.</summary>
        Task<List<TeamAnnouncement>> GetAnnouncementsAsync(string teamId, int limit = 50);

        /// <summary>Adds <paramref name="userEmail"/> to the ReadBy list of an announcement (idempotent).</summary>
        Task MarkAnnouncementReadAsync(string announcementId, string userEmail);

        // ── Dev / testing ─────────────────────────────────────────────────────
        Task ClearAllAsync();
    }
}
