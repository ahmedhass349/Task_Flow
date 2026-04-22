using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using taskflow.Data;
using taskflow.Data.Entities;
using taskflow.DTOs.Mongo;
using taskflow.Models.Mongo;
using taskflow.Services.Interfaces;

namespace taskflow.Services
{
    /// <summary>
    /// Singleton proxy around <see cref="MongoService"/> that adds offline resilience:
    /// • When online  → calls MongoDB, then asynchronously updates the local SQLite cache.
    /// • When offline → serves reads from the SQLite cache; queues writes in the outbox.
    /// </summary>
    public class OfflineAwareMongoService : IMongoService
    {
        private readonly MongoService _mongo;
        private readonly IConnectivityService _connectivity;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<OfflineAwareMongoService> _logger;

        private static readonly JsonSerializerOptions _json =
            new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        public OfflineAwareMongoService(
            MongoService mongo,
            IConnectivityService connectivity,
            IServiceScopeFactory scopeFactory,
            ILogger<OfflineAwareMongoService> logger)
        {
            _mongo = mongo;
            _connectivity = connectivity;
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        // ── Connectivity ping ─────────────────────────────────────────────────
        // FILE: Services/OfflineAwareMongoService.cs  PHASE: 1  CHANGE: implement PingAsync from IMongoService

        public Task<bool> PingAsync(CancellationToken ct = default)
            => _mongo.PingAsync(ct);

        // ── Presence ──────────────────────────────────────────────────────────

        public async Task UpsertPresenceAsync(string email, string fullName, string avatarUrl)
        {
            if (_connectivity.IsEffectivelyOnline)
            {
                await _mongo.UpsertPresenceAsync(email, fullName, avatarUrl);
                return;
            }
            QueueOutbox("UpsertPresence", new { email, fullName, avatarUrl });
        }

        // ── Search ────────────────────────────────────────────────────────────

        public async Task<List<UserSearchResultDto>> SearchUsersAsync(string query, string excludeEmail)
        {
            if (_connectivity.IsEffectivelyOnline)
                return await _mongo.SearchUsersAsync(query, excludeEmail);

            _logger.LogDebug("SearchUsersAsync: offline — returning empty.");
            return [];
        }

        // ── Invitations ───────────────────────────────────────────────────────

        public async Task<TeamInvitation> SendInvitationAsync(
            string senderUserId, string senderEmail, string senderFullName, string senderAvatarUrl,
            SendInvitationRequestDto request)
        {
            if (_connectivity.IsEffectivelyOnline)
            {
                var result = await _mongo.SendInvitationAsync(
                    senderUserId, senderEmail, senderFullName, senderAvatarUrl, request);
                _ = CacheInvitationsForSenderAsync(senderEmail);
                return result;
            }

            // Offline: optimistic local record + outbox
            var tempId = $"offline_{Guid.NewGuid():N}";
            var now = DateTime.UtcNow;

            var local = new LocalInvitation
            {
                MongoId = tempId,
                SenderEmail = senderEmail,
                SenderFullName = senderFullName,
                SenderAvatarUrl = senderAvatarUrl,
                RecipientEmail = request.RecipientEmail.Trim().ToLowerInvariant(),
                TeamId = request.TeamId,
                TeamName = request.TeamName,
                Role = request.Role ?? "Member",
                Message = request.Message,
                Status = "Pending",
                SentAt = now,
                ExpiresAt = now.AddDays(30),
            };

            QueueOutbox("SendInvitation", new
            {
                senderUserId, senderEmail, senderFullName, senderAvatarUrl,
                request.RecipientEmail, request.TeamId, request.TeamName,
                request.Message, request.Role
            });

            await PersistLocalInvitationAsync(local);
            _connectivity.IncrementPending();

            return new TeamInvitation
            {
                Id = tempId,
                SenderUserId = senderUserId,
                SenderEmail = senderEmail,
                SenderFullName = senderFullName,
                SenderAvatarUrl = senderAvatarUrl ?? string.Empty,
                RecipientEmail = local.RecipientEmail,
                TeamId = request.TeamId,
                TeamName = request.TeamName,
                Role = local.Role,
                Message = local.Message ?? string.Empty,
                Status = InvitationStatus.Pending,
                SentAt = now,
                ExpiresAt = local.ExpiresAt ?? DateTime.UtcNow.AddDays(30),
            };
        }

        public async Task<List<InvitationResponseDto>> GetIncomingInvitationsAsync(string recipientEmail)
        {
            if (_connectivity.IsEffectivelyOnline)
            {
                var results = await _mongo.GetIncomingInvitationsAsync(recipientEmail);
                _ = ImportInvitationCacheAsync(results);
                return results;
            }

            return await ReadCachedInvitationsAsync(null, recipientEmail);
        }

        public async Task<List<InvitationResponseDto>> GetOutgoingInvitationsAsync(string senderEmail)
        {
            if (_connectivity.IsEffectivelyOnline)
            {
                var results = await _mongo.GetOutgoingInvitationsAsync(senderEmail);
                _ = ImportInvitationCacheAsync(results);
                return results;
            }

            return await ReadCachedInvitationsAsync(senderEmail, null);
        }

        public async Task<TeamInvitation> AcceptInvitationAsync(string invitationId, string recipientEmail)
        {
            if (_connectivity.IsEffectivelyOnline)
            {
                var result = await _mongo.AcceptInvitationAsync(invitationId, recipientEmail);
                _ = UpdateLocalInvitationStatusAsync(invitationId, "Accepted");
                return result;
            }

            QueueOutbox("AcceptInvitation", new { invitationId, recipientEmail });
            await UpdateLocalInvitationStatusAsync(invitationId, "Accepted");
            _connectivity.IncrementPending();

            // Return a stub; fields will be refreshed on reconnect
            return new TeamInvitation
            {
                Id = invitationId,
                RecipientEmail = recipientEmail,
                Status = InvitationStatus.Accepted,
                RespondedAt = DateTime.UtcNow,
            };
        }

        public async Task<TeamInvitation> DeclineInvitationAsync(
            string invitationId, string recipientEmail, string? reason)
        {
            if (_connectivity.IsEffectivelyOnline)
            {
                var result = await _mongo.DeclineInvitationAsync(invitationId, recipientEmail, reason);
                _ = UpdateLocalInvitationStatusAsync(invitationId, "Declined");
                return result;
            }

            QueueOutbox("DeclineInvitation", new { invitationId, recipientEmail, reason });
            await UpdateLocalInvitationStatusAsync(invitationId, "Declined");
            _connectivity.IncrementPending();

            return new TeamInvitation
            {
                Id = invitationId,
                RecipientEmail = recipientEmail,
                Status = InvitationStatus.Declined,
                RespondedAt = DateTime.UtcNow,
            };
        }

        public async Task CancelInvitationAsync(string invitationId, string senderEmail)
        {
            if (_connectivity.IsEffectivelyOnline)
            {
                await _mongo.CancelInvitationAsync(invitationId, senderEmail);
                _ = UpdateLocalInvitationStatusAsync(invitationId, "Cancelled");
                return;
            }

            QueueOutbox("CancelInvitation", new { invitationId, senderEmail });
            await UpdateLocalInvitationStatusAsync(invitationId, "Cancelled");
            _connectivity.IncrementPending();
        }

        public async Task DeleteInvitationAsync(string invitationId, string ownerEmail)
        {
            if (_connectivity.IsEffectivelyOnline)
            {
                await _mongo.DeleteInvitationAsync(invitationId, ownerEmail);
                _ = DeleteLocalInvitationAsync(invitationId);
                return;
            }

            QueueOutbox("DeleteInvitation", new { invitationId, ownerEmail });
            await DeleteLocalInvitationAsync(invitationId);
            _connectivity.IncrementPending();
        }

        public async Task<List<MongoTeamMemberDto>> DeleteTeamMembersAsync(string teamId)
        {
            if (_connectivity.IsEffectivelyOnline)
                return await _mongo.DeleteTeamMembersAsync(teamId);
            return [];
        }

        public async Task<List<MongoTeamMemberDto>> GetMembershipsByUserAsync(string userEmail)
        {
            if (_connectivity.IsEffectivelyOnline)
                return await _mongo.GetMembershipsByUserAsync(userEmail);
            return [];
        }

        public async Task LeaveTeamAsync(string teamId, string userEmail)
        {
            if (_connectivity.IsEffectivelyOnline)
            {
                await _mongo.LeaveTeamAsync(teamId, userEmail);
                return;
            }
            QueueOutbox("LeaveTeam", new { teamId, userEmail });
            _connectivity.IncrementPending();
        }

        // ── Team members ──────────────────────────────────────────────────────

        public async Task<List<MongoTeamMemberDto>> GetTeamMembersAsync(string teamId, string ownerEmail)
        {
            if (_connectivity.IsEffectivelyOnline)
            {
                var results = await _mongo.GetTeamMembersAsync(teamId, ownerEmail);
                _ = ImportMemberCacheAsync(results, ownerEmail);
                return results;
            }

            return await ReadCachedMembersAsync(teamId, ownerEmail);
        }

        public async Task<List<MongoTeamMemberDto>> GetAllTeamMembersAsync(string ownerEmail)
        {
            if (_connectivity.IsEffectivelyOnline)
            {
                var results = await _mongo.GetAllTeamMembersAsync(ownerEmail);
                _ = ImportMemberCacheAsync(results, ownerEmail);
                return results;
            }

            return await ReadCachedMembersAsync(null, ownerEmail);
        }

        public async Task RemoveTeamMemberAsync(string teamId, string memberEmail, string ownerEmail)
        {
            if (_connectivity.IsEffectivelyOnline)
            {
                await _mongo.RemoveTeamMemberAsync(teamId, memberEmail, ownerEmail);
                _ = UpdateLocalMemberActiveAsync(teamId, memberEmail, ownerEmail, false);
                return;
            }

            QueueOutbox("RemoveTeamMember", new { teamId, memberEmail, ownerEmail });
            await UpdateLocalMemberActiveAsync(teamId, memberEmail, ownerEmail, false);
            _connectivity.IncrementPending();
        }

        public async Task RemoveAllMemberRecordsAsync(string memberEmail, string ownerEmail)
        {
            if (_connectivity.IsEffectivelyOnline)
            {
                await _mongo.RemoveAllMemberRecordsAsync(memberEmail, ownerEmail);
                _ = DeactivateAllLocalMembersAsync(memberEmail, ownerEmail);
                return;
            }

            QueueOutbox("RemoveAllMemberRecords", new { memberEmail, ownerEmail });
            await DeactivateAllLocalMembersAsync(memberEmail, ownerEmail);
            _connectivity.IncrementPending();
        }

        public async Task<MongoTeamMemberDto> AddMemberToTeamAsync(
            string ownerEmail, string memberEmail, string memberFullName,
            string targetTeamId, string targetTeamName, string role = "Member")
        {
            if (_connectivity.IsEffectivelyOnline)
            {
                var result = await _mongo.AddMemberToTeamAsync(
                    ownerEmail, memberEmail, memberFullName, targetTeamId, targetTeamName, role);
                _ = UpsertLocalMemberAsync(result);
                return result;
            }

            QueueOutbox("AddMemberToTeam", new
            {
                ownerEmail, memberEmail, memberFullName, targetTeamId, targetTeamName, role
            });
            _connectivity.IncrementPending();

            var tempMember = new MongoTeamMemberDto
            {
                Id = $"offline_{Guid.NewGuid():N}",
                TeamId = targetTeamId,
                TeamName = targetTeamName,
                OwnerEmail = ownerEmail,
                UserEmail = memberEmail,
                UserFullName = memberFullName,
                Role = role,
                IsActive = true,
                JoinedAt = DateTime.UtcNow,
            };
            _ = UpsertLocalMemberAsync(tempMember);
            return tempMember;
        }

        // ═════════════════════════════════════════════════════════════════════
        // Private helpers — all run in their own DI scope
        // ═════════════════════════════════════════════════════════════════════

        private void QueueOutbox(string operationName, object payload)
        {
            _ = Task.Run(async () =>
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    db.SyncOutboxEntries.Add(new SyncOutboxEntry
                    {
                        OperationName = operationName,
                        PayloadJson = JsonSerializer.Serialize(payload, _json),
                    });
                    await db.SaveChangesAsync();
                    _logger.LogDebug("Queued offline op: {Op}", operationName);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to queue outbox entry for {Op}", operationName);
                }
            });
        }

        // ── Cache import (fire-and-forget) ────────────────────────────────────

        private async Task ImportInvitationCacheAsync(List<InvitationResponseDto> dtos)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                foreach (var dto in dtos)
                {
                    var existing = await db.LocalInvitations
                        .FirstOrDefaultAsync(x => x.MongoId == dto.Id);
                    if (existing is null)
                    {
                        db.LocalInvitations.Add(DtoToLocal(dto));
                    }
                    else
                    {
                        existing.Status = dto.Status;
                        existing.RespondedAt = dto.RespondedAt;
                        existing.DeclineReason = dto.DeclineReason;
                        existing.CachedAt = DateTime.UtcNow;
                    }
                }

                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "ImportInvitationCacheAsync failed");
            }
        }

        private async Task ImportMemberCacheAsync(List<MongoTeamMemberDto> dtos, string ownerEmail)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                foreach (var dto in dtos)
                {
                    var existing = await db.LocalTeamMembers
                        .FirstOrDefaultAsync(x =>
                            x.TeamId == dto.TeamId &&
                            x.UserEmail == dto.UserEmail &&
                            x.OwnerEmail == ownerEmail);

                    if (existing is null)
                    {
                        db.LocalTeamMembers.Add(DtoToLocal(dto));
                    }
                    else
                    {
                        existing.MongoId = dto.Id;
                        existing.TeamName = dto.TeamName;
                        existing.UserFullName = dto.UserFullName;
                        existing.AvatarUrl = dto.AvatarUrl;
                        existing.Role = dto.Role;
                        existing.IsActive = dto.IsActive;
                        existing.CachedAt = DateTime.UtcNow;
                    }
                }

                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "ImportMemberCacheAsync failed");
            }
        }

        // ── Cache read helpers ────────────────────────────────────────────────

        private async Task<List<InvitationResponseDto>> ReadCachedInvitationsAsync(
            string? senderEmail, string? recipientEmail)
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var q = db.LocalInvitations.AsQueryable();
            if (senderEmail is not null)    q = q.Where(i => i.SenderEmail == senderEmail);
            if (recipientEmail is not null) q = q.Where(i => i.RecipientEmail == recipientEmail);

            q = q.Where(i => i.Status != "Expired");

            var rows = await q.OrderByDescending(i => i.SentAt).Take(50).ToListAsync();
            return rows.Select(LocalToInvDto).ToList();
        }

        private async Task<List<MongoTeamMemberDto>> ReadCachedMembersAsync(
            string? teamId, string ownerEmail)
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var q = db.LocalTeamMembers
                .Where(m => m.OwnerEmail == ownerEmail && m.IsActive);

            if (teamId is not null) q = q.Where(m => m.TeamId == teamId);

            var rows = await q.OrderByDescending(m => m.JoinedAt).ToListAsync();
            return rows.Select(LocalToMemberDto).ToList();
        }

        // ── Optimistic local state mutations ──────────────────────────────────

        private async Task PersistLocalInvitationAsync(LocalInvitation inv)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.LocalInvitations.Add(inv);
                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "PersistLocalInvitationAsync failed");
            }
        }

        private async Task UpdateLocalInvitationStatusAsync(string mongoId, string status)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var row = await db.LocalInvitations.FirstOrDefaultAsync(x => x.MongoId == mongoId);
                if (row is not null)
                {
                    row.Status = status;
                    row.RespondedAt = DateTime.UtcNow;
                    await db.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "UpdateLocalInvitationStatusAsync failed");
            }
        }

        private async Task DeleteLocalInvitationAsync(string mongoId)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var row = await db.LocalInvitations.FirstOrDefaultAsync(x => x.MongoId == mongoId);
                if (row is not null)
                {
                    db.LocalInvitations.Remove(row);
                    await db.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "DeleteLocalInvitationAsync failed");
            }
        }

        private async Task CacheInvitationsForSenderAsync(string senderEmail)
        {
            try
            {
                var fresh = await _mongo.GetOutgoingInvitationsAsync(senderEmail);
                await ImportInvitationCacheAsync(fresh);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "CacheInvitationsForSenderAsync failed");
            }
        }

        private async Task UpdateLocalMemberActiveAsync(
            string teamId, string memberEmail, string ownerEmail, bool isActive)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var row = await db.LocalTeamMembers.FirstOrDefaultAsync(m =>
                    m.TeamId == teamId && m.UserEmail == memberEmail && m.OwnerEmail == ownerEmail);
                if (row is not null)
                {
                    row.IsActive = isActive;
                    await db.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "UpdateLocalMemberActiveAsync failed");
            }
        }

        private async Task DeactivateAllLocalMembersAsync(string memberEmail, string ownerEmail)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var rows = await db.LocalTeamMembers
                    .Where(m => m.UserEmail == memberEmail && m.OwnerEmail == ownerEmail)
                    .ToListAsync();
                rows.ForEach(r => r.IsActive = false);
                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "DeactivateAllLocalMembersAsync failed");
            }
        }

        private async Task UpsertLocalMemberAsync(MongoTeamMemberDto dto)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var row = await db.LocalTeamMembers.FirstOrDefaultAsync(m =>
                    m.TeamId == dto.TeamId &&
                    m.UserEmail == dto.UserEmail &&
                    m.OwnerEmail == dto.OwnerEmail);
                if (row is null)
                    db.LocalTeamMembers.Add(DtoToLocal(dto));
                else
                {
                    row.MongoId = dto.Id;
                    row.TeamName = dto.TeamName;
                    row.UserFullName = dto.UserFullName;
                    row.AvatarUrl = dto.AvatarUrl;
                    row.Role = dto.Role;
                    row.IsActive = dto.IsActive;
                    row.CachedAt = DateTime.UtcNow;
                }
                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "UpsertLocalMemberAsync failed");
            }
        }

        // ── Mapping helpers ───────────────────────────────────────────────────

        private static LocalInvitation DtoToLocal(InvitationResponseDto d) => new()
        {
            MongoId = d.Id,
            SenderEmail = d.SenderEmail,
            SenderFullName = d.SenderFullName,
            SenderAvatarUrl = d.SenderAvatarUrl ?? string.Empty,
            RecipientEmail = d.RecipientEmail,
            RecipientFullName = d.RecipientFullName ?? string.Empty,
            TeamId = d.TeamId,
            TeamName = d.TeamName,
            Role = d.Role ?? "Member",
            Message = d.Message,
            Status = d.Status,
            SentAt = d.SentAt,
            RespondedAt = d.RespondedAt,
            ExpiresAt = d.ExpiresAt,
            DeclineReason = d.DeclineReason,
        };

        private static LocalTeamMember DtoToLocal(MongoTeamMemberDto d) => new()
        {
            MongoId = d.Id,
            TeamId = d.TeamId,
            TeamName = d.TeamName,
            OwnerEmail = d.OwnerEmail,
            UserEmail = d.UserEmail,
            UserFullName = d.UserFullName,
            AvatarUrl = d.AvatarUrl,
            Role = d.Role,
            IsActive = d.IsActive,
            JoinedAt = d.JoinedAt,
        };

        private static InvitationResponseDto LocalToInvDto(LocalInvitation i) => new()
        {
            Id = i.MongoId,
            SenderEmail = i.SenderEmail,
            SenderFullName = i.SenderFullName,
            SenderAvatarUrl = i.SenderAvatarUrl,
            RecipientEmail = i.RecipientEmail,
            RecipientFullName = i.RecipientFullName,
            TeamId = i.TeamId,
            TeamName = i.TeamName,
            Message = i.Message,
            Role = i.Role,
            Status = i.Status,
            SentAt = i.SentAt,
            RespondedAt = i.RespondedAt,
            ExpiresAt = i.ExpiresAt ?? DateTime.UtcNow.AddDays(30),
            DeclineReason = i.DeclineReason,
        };

        private static MongoTeamMemberDto LocalToMemberDto(LocalTeamMember m) => new()
        {
            Id = m.MongoId,
            TeamId = m.TeamId,
            TeamName = m.TeamName,
            OwnerEmail = m.OwnerEmail,
            UserEmail = m.UserEmail,
            UserFullName = m.UserFullName,
            AvatarUrl = m.AvatarUrl,
            Role = m.Role,
            IsActive = m.IsActive,
            JoinedAt = m.JoinedAt,
        };

        // ── Dev / testing ─────────────────────────────────────────────────────

        public Task ClearAllAsync() => _mongo.ClearAllAsync();

        public async Task DeleteUserDataAsync(string userEmail)
        {
            if (_connectivity.IsEffectivelyOnline)
            {
                await _mongo.DeleteUserDataAsync(userEmail);
                return;
            }
            QueueOutbox("DeleteUserData", new { userEmail });
            _connectivity.IncrementPending();
        }
    }
}
