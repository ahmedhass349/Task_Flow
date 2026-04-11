// FILE: Controllers/Api/TeamsController.cs
// STATUS: MODIFIED
// CHANGES: Fixed GetUserId() (#3), removed try-catch (#15), fixed null! (#6),
//          added PUT/DELETE team + DELETE member endpoints (#22), cleaned usings (#17), standardized route (#20),
//          added MongoDB invitation relay endpoints (Phase 2)

using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using taskflow.Data.Entities;
using taskflow.DTOs.Mongo;
using taskflow.DTOs.Teams;
using taskflow.Helpers;
using taskflow.Repositories.Interfaces;
using taskflow.Services.Interfaces;

namespace taskflow.Controllers.Api
{
    /// <summary>
    /// API controller for managing teams and team membership.
    /// Extends with MongoDB-backed invitation relay (Phase 2).
    /// </summary>
    [ApiController]
    [Route("api/teams")]
    [Authorize]
    public class TeamsController : ControllerBase
    {
        private readonly ITeamService _teamService;
        private readonly IMongoService _mongoService;
        private readonly INotificationService _notificationService;
        private readonly IUserRepository _userRepository;

        public TeamsController(ITeamService teamService, IMongoService mongoService,
            INotificationService notificationService, IUserRepository userRepository)
        {
            _teamService = teamService;
            _mongoService = mongoService;
            _notificationService = notificationService;
            _userRepository = userRepository;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out var userId))
                throw new UnauthorizedAccessException("User identity could not be determined.");
            return userId;
        }

        private string GetUserEmail()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
                throw new UnauthorizedAccessException("User email could not be determined.");
            return email;
        }

        private string GetUserFullName() =>
            User.FindFirst(ClaimTypes.Name)?.Value ?? string.Empty;

        /// <summary>
        /// Retrieves all teams the authenticated user belongs to.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetUserTeams()
        {
            var userId = GetUserId();
            var teams = await _teamService.GetUserTeamsAsync(userId);
            return Ok(ApiResponse<IEnumerable<TeamDto>>.Ok(teams, "Teams retrieved successfully"));
        }

        /// <summary>
        /// Creates a new team owned by the authenticated user.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateTeam([FromBody] CreateTeamRequest request)
        {
            var userId = GetUserId();
            var team = await _teamService.CreateTeamAsync(userId, request);
            return StatusCode(201, ApiResponse<TeamDto>.Ok(team, "Team created successfully"));
        }

        /// <summary>
        /// Updates an existing team.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTeam(int id, [FromBody] UpdateTeamRequest request)
        {
            var userId = GetUserId();
            var team = await _teamService.UpdateTeamAsync(userId, id, request);
            return Ok(ApiResponse<TeamDto>.Ok(team, "Team updated successfully"));
        }

        /// <summary>
        /// Deletes a team by its identifier.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeam(int id)
        {
            var userId = GetUserId();
            await _teamService.DeleteTeamAsync(userId, id);
            return NoContent();
        }

        /// <summary>
        /// Retrieves all members of a specific team.
        /// </summary>
        [HttpGet("{id}/members")]
        public async Task<IActionResult> GetTeamMembers(int id)
        {
            var members = await _teamService.GetTeamMembersAsync(id);
            return Ok(ApiResponse<IEnumerable<TeamMemberDto>>.Ok(members, "Team members retrieved successfully"));
        }

        /// <summary>
        /// Adds a new member to a specific team.
        /// </summary>
        [HttpPost("{id}/members")]
        public async Task<IActionResult> AddTeamMember(int id, [FromBody] AddTeamMemberRequest request)
        {
            await _teamService.AddTeamMemberAsync(id, request);
            return StatusCode(201, ApiResponse<string>.Ok("Member added", "Team member added successfully"));
        }

        /// <summary>
        /// Removes a member from a specific team.
        /// </summary>
        [HttpDelete("{id}/members/{memberUserId}")]
        public async Task<IActionResult> RemoveTeamMember(int id, int memberUserId)
        {
            var userId = GetUserId();
            await _teamService.RemoveTeamMemberAsync(userId, id, memberUserId);
            return NoContent();
        }

        // ── MongoDB invitation relay endpoints ────────────────────────────────

        /// <summary>
        /// Upserts the current user's discoverable presence in the shared MongoDB relay.
        /// Called on login / app startup so other users can search for this user.
        /// </summary>
        [HttpPost("presence")]
        public async Task<IActionResult> UpsertPresence()
        {
            try
            {
                var email = GetUserEmail();
                var fullName = GetUserFullName();
                await _mongoService.UpsertPresenceAsync(email, fullName, string.Empty);
                return Ok(ApiResponse<string>.Ok("Presence updated", "Presence updated"));
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return Ok(ApiResponse<string>.Ok("Presence update skipped", "MongoDB unavailable"));
            }
        }

        /// <summary>
        /// Searches for users in the shared MongoDB relay by email or name.
        /// </summary>
        [HttpGet("users/search")]
        public async Task<IActionResult> SearchUsers([FromQuery] string q)
        {
            try
            {
                var email = GetUserEmail();
                var results = await _mongoService.SearchUsersAsync(q, email);
                return Ok(ApiResponse<List<UserSearchResultDto>>.Ok(results, "Search complete"));
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return Ok(ApiResponse<List<UserSearchResultDto>>.Ok([], "Search unavailable"));
            }
        }

        /// <summary>
        /// Sends a team invitation to a user identified by email.
        /// </summary>
        [HttpPost("invitations/send")]
        public async Task<IActionResult> SendInvitation([FromBody] SendInvitationRequestDto request)
        {
            try
            {
                var userId = GetUserId();
                var email = GetUserEmail();
                var fullName = GetUserFullName();
                var invitation = await _mongoService.SendInvitationAsync(
                    userId.ToString(), email, fullName, string.Empty, request);

                // Push real-time notification to recipient
                try
                {
                    var recipient = await _userRepository.GetByEmailAsync(request.RecipientEmail);
                    if (recipient != null)
                    {
                        var teamLabel = string.IsNullOrEmpty(request.TeamName) ? "your team" : request.TeamName;
                        await _notificationService.CreateAsync(
                            recipient.Id,
                            "Team Invitation",
                            $"{fullName} invited you to join {teamLabel}.",
                            NotificationType.TeamInvitationReceived,
                            NotificationPriority.Medium,
                            actionUrl: "/teams"
                        );
                    }
                }
                catch { /* notification failure must not break the invite */ }

                return StatusCode(201, ApiResponse<InvitationResponseDto>.Ok(
                    MapToDto(invitation), "Invitation sent"));
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return StatusCode(503, ApiResponse<string>.Fail($"Could not send invitation: {ex.Message}"));
            }
        }

        /// <summary>
        /// Cancels a pending outgoing invitation sent by the current user.
        /// </summary>
        [HttpDelete("invitations/{invitationId}/cancel")]
        public async Task<IActionResult> CancelInvitation(string invitationId)
        {
            try
            {
                var email = GetUserEmail();
                await _mongoService.CancelInvitationAsync(invitationId, email);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<string>.Fail("Invitation not found or already responded to."));
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return StatusCode(503, ApiResponse<string>.Fail($"Could not cancel invitation: {ex.Message}"));
            }
        }

        /// <summary>
        /// Returns all incoming (received) invitations for the current user.
        /// </summary>
        [HttpGet("invitations/incoming")]
        public async Task<IActionResult> GetIncomingInvitations()
        {
            try
            {
                var email = GetUserEmail();
                var invitations = await _mongoService.GetIncomingInvitationsAsync(email);
                return Ok(ApiResponse<List<InvitationResponseDto>>.Ok(invitations, "Incoming invitations retrieved"));
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return Ok(ApiResponse<List<InvitationResponseDto>>.Ok([], "Invitations unavailable"));
            }
        }

        /// <summary>
        /// Returns all outgoing (sent) invitations by the current user.
        /// </summary>
        [HttpGet("invitations/outgoing")]
        public async Task<IActionResult> GetOutgoingInvitations()
        {
            try
            {
                var email = GetUserEmail();
                var invitations = await _mongoService.GetOutgoingInvitationsAsync(email);
                return Ok(ApiResponse<List<InvitationResponseDto>>.Ok(invitations, "Outgoing invitations retrieved"));
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return Ok(ApiResponse<List<InvitationResponseDto>>.Ok([], "Invitations unavailable"));
            }
        }

        /// <summary>
        /// Accepts an incoming invitation.
        /// </summary>
        [HttpPost("invitations/{invitationId}/accept")]
        public async Task<IActionResult> AcceptInvitation(string invitationId)
        {
            try
            {
                var email = GetUserEmail();
                var invitation = await _mongoService.AcceptInvitationAsync(invitationId, email);

                // Push real-time notification to the sender
                try
                {
                    var sender = await _userRepository.GetByEmailAsync(invitation.SenderEmail);
                    if (sender != null)
                    {
                        var recipientName = GetUserFullName();
                        var teamLabel = string.IsNullOrEmpty(invitation.TeamName) ? "your invitation" : $"your {invitation.TeamName} invitation";
                        await _notificationService.CreateAsync(
                            sender.Id,
                            "Invitation Accepted",
                            $"{(string.IsNullOrEmpty(recipientName) ? email : recipientName)} accepted {teamLabel}.",
                            NotificationType.TeamInvitationAccepted,
                            NotificationPriority.Medium,
                            actionUrl: "/teams"
                        );
                    }
                }
                catch { /* notification failure must not break the accept */ }

                return Ok(ApiResponse<InvitationResponseDto>.Ok(MapToDto(invitation), "Invitation accepted"));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<string>.Fail("Invitation not found or already responded to."));
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return StatusCode(503, ApiResponse<string>.Fail($"Could not accept invitation: {ex.Message}"));
            }
        }

        /// <summary>
        /// Declines an incoming invitation.
        /// </summary>
        [HttpPost("invitations/{invitationId}/decline")]
        public async Task<IActionResult> DeclineInvitation(string invitationId, [FromBody] DeclineReasonDto? body)
        {
            try
            {
                var email = GetUserEmail();
                var invitation = await _mongoService.DeclineInvitationAsync(invitationId, email, body?.Reason);

                // Push real-time notification to the sender
                try
                {
                    var sender = await _userRepository.GetByEmailAsync(invitation.SenderEmail);
                    if (sender != null)
                    {
                        var recipientName = GetUserFullName();
                        var teamLabel = string.IsNullOrEmpty(invitation.TeamName) ? "your invitation" : $"your {invitation.TeamName} invitation";
                        await _notificationService.CreateAsync(
                            sender.Id,
                            "Invitation Declined",
                            $"{(string.IsNullOrEmpty(recipientName) ? email : recipientName)} declined {teamLabel}.",
                            NotificationType.TeamInvitationDeclined,
                            NotificationPriority.Low,
                            actionUrl: "/teams"
                        );
                    }
                }
                catch { /* notification failure must not break the decline */ }

                return Ok(ApiResponse<InvitationResponseDto>.Ok(MapToDto(invitation), "Invitation declined"));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<string>.Fail("Invitation not found or already responded to."));
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return StatusCode(503, ApiResponse<string>.Fail($"Could not decline invitation: {ex.Message}"));
            }
        }

        /// <summary>
        /// Permanently deletes a sent invitation (any status) owned by the current user.
        /// </summary>
        [HttpDelete("invitations/{invitationId}")]
        public async Task<IActionResult> DeleteInvitation(string invitationId)
        {
            try
            {
                var email = GetUserEmail();
                await _mongoService.DeleteInvitationAsync(invitationId, email);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<string>.Fail("Invitation not found."));
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return StatusCode(503, ApiResponse<string>.Fail($"Could not delete invitation: {ex.Message}"));
            }
        }

        /// <summary>
        /// Assigns an existing shared member to a specific team.
        /// </summary>
        [HttpPost("{teamId}/members-shared/assign")]
        public async Task<IActionResult> AssignMemberToTeam(string teamId, [FromBody] AssignMemberRequestDto request)
        {
            try
            {
                var email = GetUserEmail();
                var team = await _teamService.GetUserTeamsAsync(GetUserId());
                // Resolve team name from local teams
                string teamName = string.Empty;
                foreach (var t in team)
                    if (t.Id.ToString() == teamId) { teamName = t.Name; break; }

                var member = await _mongoService.AddMemberToTeamAsync(
                    email, request.MemberEmail, request.MemberFullName, teamId, teamName);
                return StatusCode(201, ApiResponse<MongoTeamMemberDto>.Ok(member, "Member assigned to team"));
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return StatusCode(503, ApiResponse<string>.Fail($"Could not assign member: {ex.Message}"));
            }
        }

        /// <summary>
        /// Removes all team memberships for a given member across all teams owned by the current user.
        /// </summary>
        [HttpDelete("members-shared-all/{memberEmail}")]
        public async Task<IActionResult> RemoveAllMemberRecords(string memberEmail)
        {
            try
            {
                var email = GetUserEmail();
                await _mongoService.RemoveAllMemberRecordsAsync(memberEmail, email);
                return NoContent();
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return StatusCode(503, ApiResponse<string>.Fail($"Could not remove member: {ex.Message}"));
            }
        }

        /// <summary>
        /// Returns all shared (MongoDB) team members across all teams owned by the current user.
        /// </summary>
        [HttpGet("members-shared/all")]
        public async Task<IActionResult> GetAllSharedTeamMembers()
        {
            try
            {
                var email = GetUserEmail();
                var members = await _mongoService.GetAllTeamMembersAsync(email);
                return Ok(ApiResponse<List<MongoTeamMemberDto>>.Ok(members, "All shared team members retrieved"));
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return Ok(ApiResponse<List<MongoTeamMemberDto>>.Ok([], "Members unavailable"));
            }
        }

        /// <summary>
        /// Returns shared (MongoDB) team members for a team owned by the current user.
        /// Uses path suffix "-shared" to avoid conflict with the SQLite /{id}/members endpoint.
        /// </summary>
        [HttpGet("{teamId}/members-shared")]
        public async Task<IActionResult> GetSharedTeamMembers(string teamId)
        {
            try
            {
                var email = GetUserEmail();
                var members = await _mongoService.GetTeamMembersAsync(teamId, email);
                return Ok(ApiResponse<List<MongoTeamMemberDto>>.Ok(members, "Shared team members retrieved"));
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return Ok(ApiResponse<List<MongoTeamMemberDto>>.Ok([], "Members unavailable"));
            }
        }

        /// <summary>
        /// Removes a shared (MongoDB) team member identified by email.
        /// </summary>
        [HttpDelete("{teamId}/members-shared/{memberEmail}")]
        public async Task<IActionResult> RemoveSharedTeamMember(string teamId, string memberEmail)
        {
            try
            {
                var email = GetUserEmail();
                await _mongoService.RemoveTeamMemberAsync(teamId, memberEmail, email);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<string>.Fail("Team member not found."));
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return StatusCode(503, ApiResponse<string>.Fail($"Could not remove member: {ex.Message}"));
            }
        }

        // ── Private helpers ───────────────────────────────────────────────────

        private static InvitationResponseDto MapToDto(taskflow.Models.Mongo.TeamInvitation i) => new()
        {
            Id = i.Id ?? string.Empty,
            SenderEmail = i.SenderEmail,
            SenderFullName = i.SenderFullName,
            SenderAvatarUrl = i.SenderAvatarUrl,
            RecipientEmail = i.RecipientEmail,
            RecipientFullName = i.RecipientFullName,
            TeamId = i.TeamId,
            TeamName = i.TeamName,
            Message = i.Message,
            Role = i.Role,
            Status = i.Status.ToString(),
            SentAt = i.SentAt,
            RespondedAt = i.RespondedAt,
            ExpiresAt = i.ExpiresAt,
            DeclineReason = i.DeclineReason,
        };
    }

    /// <summary>Body for decline reason.</summary>
    public class DeclineReasonDto
    {
        public string? Reason { get; set; }
    }
}
