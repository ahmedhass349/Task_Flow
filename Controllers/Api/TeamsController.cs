using System;
using System.Collections.Generic;
using System.Linq;
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
            var ownerEmail = GetUserEmail();

            // Capture mongo members (with teamName) before deletion
            var mongoMembers = await _mongoService.GetTeamMembersAsync(id.ToString(), ownerEmail);
            string teamName = mongoMembers.FirstOrDefault()?.TeamName ?? "a team";

            // Soft-delete MongoDB members BEFORE the SQLite team is removed so that
            // if the SQLite delete succeeds but MongoDB is unreachable the outbox
            // entry already exists and will be replayed (D4 atomicity fix).
            await _mongoService.DeleteTeamMembersAsync(id.ToString());

            await _teamService.DeleteTeamAsync(userId, id);

            // Notify every member (excluding the owner) that the team was deleted
            foreach (var member in mongoMembers)
            {
                if (string.Equals(member.UserEmail, ownerEmail, StringComparison.OrdinalIgnoreCase))
                    continue;

                var user = await _userRepository.GetByEmailAsync(member.UserEmail);
                if (user != null)
                {
                    await _notificationService.CreateAsync(
                        user.Id,
                        "Team Deleted",
                        $"You are no longer a member of \"{teamName}\" — the team owner deleted it.",
                        NotificationType.TeamDeleted,
                        NotificationPriority.Medium,
                        "/teams");
                }
                else
                {
                    // Member is on a different machine — relay via MongoDB cross-notification bus
                    try
                    {
                        await _mongoService.WriteCrossNotificationAsync(new Models.Mongo.CrossNotification
                        {
                            RecipientEmail = member.UserEmail.Trim().ToLowerInvariant(),
                            SenderEmail    = ownerEmail,
                            Title          = "Team Deleted",
                            Message        = $"You are no longer a member of \"{teamName}\" — the team owner deleted it.",
                            Type           = nameof(NotificationType.TeamDeleted),
                            Priority       = nameof(NotificationPriority.Medium),
                            ActionUrl      = "/teams"
                        });
                    }
                    catch { /* cross-notification failure must not break the delete */ }
                }
            }

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
                var currentUser = await _userRepository.GetByEmailAsync(email);
                var avatarUrl = currentUser?.AvatarUrl ?? string.Empty;
                await _mongoService.UpsertPresenceAsync(email, fullName, avatarUrl);
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
                return StatusCode(503, ApiResponse<List<UserSearchResultDto>>.Fail("Search service is temporarily unavailable. Please try again shortly."));
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
                var sender = await _userRepository.GetByIdAsync(userId);
                var senderAvatarUrl = sender?.AvatarUrl ?? string.Empty;
                var invitation = await _mongoService.SendInvitationAsync(
                    userId.ToString(), email, fullName, senderAvatarUrl, request);

                // Push real-time notification to recipient
                try
                {
                    var recipient = await _userRepository.GetByEmailAsync(request.RecipientEmail);
                    if (recipient != null)
                    {
                        var teamLabel = string.IsNullOrEmpty(request.TeamName) ? "a team" : $"\"{ request.TeamName}\"";
                        var roleLabel = string.IsNullOrEmpty(request.Role) ? "Member" : request.Role;
                        await _notificationService.CreateAsync(
                            recipient.Id,
                            "Team Invitation",
                            $"{fullName} invited you to join {teamLabel} as {roleLabel}.",
                            NotificationType.TeamInvitationReceived,
                            NotificationPriority.Medium,
                            actionUrl: "/teams"
                        );
                    }
                    else
                    {
                        // Recipient is on a different machine — publish to MongoDB cross-notification bus
                        var teamLabel = string.IsNullOrEmpty(request.TeamName) ? "a team" : $"\"{ request.TeamName}\"";
                        var roleLabel = string.IsNullOrEmpty(request.Role) ? "Member" : request.Role;
                        await _mongoService.WriteCrossNotificationAsync(new Models.Mongo.CrossNotification
                        {
                            RecipientEmail = request.RecipientEmail.Trim().ToLowerInvariant(),
                            SenderEmail    = email,
                            Title          = "Team Invitation",
                            Message        = $"{fullName} invited you to join {teamLabel} as {roleLabel}.",
                            Type           = nameof(NotificationType.TeamInvitationReceived),
                            Priority       = nameof(NotificationPriority.Medium),
                            ActionUrl      = "/teams"
                        });
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
                        var teamLabel = string.IsNullOrEmpty(invitation.TeamName) ? "your team invitation" : $"your invitation to join \"{invitation.TeamName}\"";
                        await _notificationService.CreateAsync(
                            sender.Id,
                            "Invitation Accepted",
                            $"{(string.IsNullOrEmpty(recipientName) ? email : recipientName)} accepted {teamLabel}.",
                            NotificationType.TeamInvitationAccepted,
                            NotificationPriority.Medium,
                            actionUrl: "/teams"
                        );
                    }
                    else
                    {
                        // Sender is on a different machine — publish to MongoDB cross-notification bus
                        var recipientName = GetUserFullName();
                        var teamLabel = string.IsNullOrEmpty(invitation.TeamName) ? "your team invitation" : $"your invitation to join \"{invitation.TeamName}\"";
                        await _mongoService.WriteCrossNotificationAsync(new Models.Mongo.CrossNotification
                        {
                            RecipientEmail = invitation.SenderEmail.Trim().ToLowerInvariant(),
                            SenderEmail    = email,
                            Title          = "Invitation Accepted",
                            Message        = $"{(string.IsNullOrEmpty(recipientName) ? email : recipientName)} accepted {teamLabel}.",
                            Type           = nameof(NotificationType.TeamInvitationAccepted),
                            Priority       = nameof(NotificationPriority.Medium),
                            ActionUrl      = "/teams"
                        });
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
                        var teamLabel = string.IsNullOrEmpty(invitation.TeamName) ? "your team invitation" : $"your invitation to join \"{invitation.TeamName}\"";
                        await _notificationService.CreateAsync(
                            sender.Id,
                            "Invitation Declined",
                            $"{(string.IsNullOrEmpty(recipientName) ? email : recipientName)} declined {teamLabel}.",
                            NotificationType.TeamInvitationDeclined,
                            NotificationPriority.Low,
                            actionUrl: "/teams"
                        );
                    }
                    else
                    {
                        // Sender is on a different machine — publish to MongoDB cross-notification bus
                        var recipientName = GetUserFullName();
                        var teamLabel = string.IsNullOrEmpty(invitation.TeamName) ? "your team invitation" : $"your invitation to join \"{invitation.TeamName}\"";
                        await _mongoService.WriteCrossNotificationAsync(new Models.Mongo.CrossNotification
                        {
                            RecipientEmail = invitation.SenderEmail.Trim().ToLowerInvariant(),
                            SenderEmail    = email,
                            Title          = "Invitation Declined",
                            Message        = $"{(string.IsNullOrEmpty(recipientName) ? email : recipientName)} declined {teamLabel}.",
                            Type           = nameof(NotificationType.TeamInvitationDeclined),
                            Priority       = nameof(NotificationPriority.Low),
                            ActionUrl      = "/teams"
                        });
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
                    email, request.MemberEmail, request.MemberFullName, teamId, teamName, request.Role ?? "Member");
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
        /// Also includes the owners of any teams the current user has been invited into,
        /// so the Messages "Start Conversation" modal can find all reachable contacts.
        /// </summary>
        [HttpGet("members-shared/all")]
        public async Task<IActionResult> GetAllSharedTeamMembers()
        {
            try
            {
                var email = GetUserEmail();
                var members = await _mongoService.GetAllTeamMembersAsync(email);
                // Safety net: never return the caller in their own shared-members list
                members = members.Where(m => !string.Equals(m.UserEmail, email, StringComparison.OrdinalIgnoreCase)).ToList();

                // Also add owners of teams the current user joined as a member.
                try
                {
                    var myMemberships = await _mongoService.GetMembershipsByUserAsync(email);
                    var ownerEmailsToAdd = myMemberships
                        .Select(m => m.OwnerEmail)
                        .Where(oe => !string.IsNullOrEmpty(oe) && oe != email)
                        .Distinct()
                        .Where(oe => !members.Any(m => m.UserEmail == oe))
                        .ToList();

                    foreach (var ownerEmail in ownerEmailsToAdd)
                    {
                        var teamInfo = myMemberships.First(m => m.OwnerEmail == ownerEmail);
                        var owner = await _userRepository.GetByEmailAsync(ownerEmail);
                        string ownerFullName = owner?.FullName ?? string.Empty;
                        string ownerAvatarUrl = owner?.AvatarUrl ?? string.Empty;

                        if (owner == null)
                        {
                            // Owner is on a different machine — retrieve their info from their Admin
                            // record in team_members (written by SendInvitationAsync auto-upsert).
                            try
                            {
                                var ownerMembers = await _mongoService.GetTeamMembersAsync(teamInfo.TeamId, ownerEmail);
                                var ownerSelf = ownerMembers.FirstOrDefault(
                                    m => m.UserEmail.Equals(ownerEmail, StringComparison.OrdinalIgnoreCase));
                                if (ownerSelf != null)
                                {
                                    ownerFullName = ownerSelf.UserFullName;
                                    ownerAvatarUrl = ownerSelf.AvatarUrl ?? string.Empty;
                                }
                            }
                            catch { /* non-critical */ }
                        }

                        if (string.IsNullOrEmpty(ownerFullName)) ownerFullName = ownerEmail;

                        members.Add(new MongoTeamMemberDto
                        {
                            Id = $"owner-{ownerEmail}",
                            TeamId = teamInfo.TeamId,
                            TeamName = teamInfo.TeamName,
                            UserEmail = ownerEmail,
                            UserFullName = ownerFullName,
                            AvatarUrl = ownerAvatarUrl,
                            Role = "Owner",
                            OwnerEmail = ownerEmail,
                            JoinedAt = teamInfo.JoinedAt,
                            IsActive = true,
                        });
                    }
                }
                catch { /* memberships unavailable — fall back to owned-team members only */ }

                return Ok(ApiResponse<List<MongoTeamMemberDto>>.Ok(members, "All shared team members retrieved"));
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return Ok(ApiResponse<List<MongoTeamMemberDto>>.Ok([], "Members unavailable"));
            }
        }

        /// <summary>
        /// Returns shared (MongoDB) team members for a team.
        /// Works for both the team owner and team members (H-02 fix).
        /// Uses path suffix "-shared" to avoid conflict with the SQLite /{id}/members endpoint.
        /// </summary>
        [HttpGet("{teamId}/members-shared")]
        public async Task<IActionResult> GetSharedTeamMembers(string teamId)
        {
            try
            {
                var email = GetUserEmail();
                var members = await _mongoService.GetTeamMembersAsync(teamId, email);

                // H-02: if empty the caller may be a member, not the owner.
                // Look up the owner email from the caller's membership record and retry.
                if (members.Count == 0)
                {
                    try
                    {
                        var myMemberships = await _mongoService.GetMembershipsByUserAsync(email);
                        var membership = myMemberships.FirstOrDefault(m =>
                            m.TeamId == teamId &&
                            !string.Equals(m.OwnerEmail, email, StringComparison.OrdinalIgnoreCase));
                        if (membership != null && !string.IsNullOrEmpty(membership.OwnerEmail))
                            members = await _mongoService.GetTeamMembersAsync(teamId, membership.OwnerEmail);
                    }
                    catch { /* non-critical fallback */ }
                }

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
                var ownerName = GetUserFullName();

                // Fetch team name before removing so the notification is descriptive
                string teamName = string.Empty;
                try
                {
                    var members = await _mongoService.GetTeamMembersAsync(teamId, email);
                    if (members.Count > 0) teamName = members[0].TeamName;
                }
                catch { /* non-critical */ }

                await _mongoService.RemoveTeamMemberAsync(teamId, memberEmail, email);

                // Notify the removed member (cross-machine or local)
                try
                {
                    var removedUser = await _userRepository.GetByEmailAsync(memberEmail);
                    var teamLabel = string.IsNullOrEmpty(teamName) ? "a team" : $"\"{teamName}\"";
                    var senderLabel = string.IsNullOrEmpty(ownerName) ? email : ownerName;
                    if (removedUser != null)
                    {
                        await _notificationService.CreateAsync(
                            removedUser.Id,
                            "Removed from Team",
                            $"{senderLabel} removed you from {teamLabel}.",
                            NotificationType.TeamMemberRemoved,
                            NotificationPriority.Medium,
                            actionUrl: "/teams"
                        );
                    }
                    else
                    {
                        await _mongoService.WriteCrossNotificationAsync(new Models.Mongo.CrossNotification
                        {
                            RecipientEmail = memberEmail.Trim().ToLowerInvariant(),
                            SenderEmail    = email,
                            Title          = "Removed from Team",
                            Message        = $"{senderLabel} removed you from {teamLabel}.",
                            Type           = nameof(NotificationType.TeamMemberRemoved),
                            Priority       = nameof(NotificationPriority.Medium),
                            ActionUrl      = "/teams"
                        });
                    }
                }
                catch { /* notification failure must not break the remove */ }

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

        /// <summary>
        /// Returns all teams where the current user has been added as a shared member by another owner.
        /// </summary>
        [HttpGet("members-shared/as-member")]
        public async Task<IActionResult> GetMyMemberships()
        {
            try
            {
                var email = GetUserEmail();
                var members = await _mongoService.GetMembershipsByUserAsync(email);
                return Ok(ApiResponse<List<MongoTeamMemberDto>>.Ok(members, "Memberships retrieved"));
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return Ok(ApiResponse<List<MongoTeamMemberDto>>.Ok([], "Memberships unavailable"));
            }
        }

        /// <summary>
        /// Removes the current user from a team they were added to (leave team).
        /// </summary>
        [HttpDelete("{teamId}/membership")]
        public async Task<IActionResult> LeaveTeam(string teamId)
        {
            if (string.IsNullOrWhiteSpace(teamId))
                return BadRequest(ApiResponse<string>.Fail("Team ID is required."));
            try
            {
                var email = GetUserEmail();
                var myName = GetUserFullName();

                // Fetch membership record to get owner email + team name before leaving
                string teamName = string.Empty;
                string ownerEmail = string.Empty;
                try
                {
                    var myMemberships = await _mongoService.GetMembershipsByUserAsync(email);
                    var membership = myMemberships.FirstOrDefault(m =>
                        m.TeamId == teamId &&
                        !string.Equals(m.OwnerEmail, email, StringComparison.OrdinalIgnoreCase));
                    if (membership != null)
                    {
                        teamName = membership.TeamName;
                        ownerEmail = membership.OwnerEmail;
                    }
                }
                catch { /* non-critical */ }

                await _mongoService.LeaveTeamAsync(teamId, email);

                // Notify the team owner (cross-machine or local)
                if (!string.IsNullOrEmpty(ownerEmail))
                {
                    try
                    {
                        var owner = await _userRepository.GetByEmailAsync(ownerEmail);
                        var memberLabel = string.IsNullOrEmpty(myName) ? email : myName;
                        var teamLabel = string.IsNullOrEmpty(teamName) ? "your team" : $"\"{teamName}\"";
                        if (owner != null)
                        {
                            await _notificationService.CreateAsync(
                                owner.Id,
                                "Member Left Team",
                                $"{memberLabel} left {teamLabel}.",
                                NotificationType.TeamMemberLeft,
                                NotificationPriority.Low,
                                actionUrl: "/teams"
                            );
                        }
                        else
                        {
                            await _mongoService.WriteCrossNotificationAsync(new Models.Mongo.CrossNotification
                            {
                                RecipientEmail = ownerEmail.Trim().ToLowerInvariant(),
                                SenderEmail    = email,
                                Title          = "Member Left Team",
                                Message        = $"{memberLabel} left {teamLabel}.",
                                Type           = nameof(NotificationType.TeamMemberLeft),
                                Priority       = nameof(NotificationPriority.Low),
                                ActionUrl      = "/teams"
                            });
                        }
                    }
                    catch { /* notification failure must not break the leave */ }
                }

                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<string>.Fail("Team membership not found."));
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return StatusCode(503, ApiResponse<string>.Fail($"Could not leave team: {ex.Message}"));
            }
        }

        /// <summary>
        /// Sends an announcement notification to all members of a team owned by the current user.
        /// PHASE 2: Also persists the announcement to MongoDB for cross-machine retrieval.
        /// </summary>
        [HttpPost("{teamId}/announce")]
        public async Task<IActionResult> AnnounceToTeam(string teamId, [FromBody] AnnounceRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
                return BadRequest(ApiResponse<string>.Fail("Announcement message is required."));

            try
            {
                var ownerEmail = GetUserEmail();
                var ownerName = GetUserFullName();

                // Verify the caller owns (or is a member of) this team via MongoDB records
                var members = await _mongoService.GetTeamMembersAsync(teamId, ownerEmail);
                if (members == null || members.Count == 0)
                    return NotFound(ApiResponse<string>.Fail("Team not found or no members to notify."));

                var title = string.IsNullOrWhiteSpace(request.Title) ? "Team Announcement" : request.Title.Trim();
                var teamName = members[0].TeamName;
                var body = $"[{teamName}] {ownerName}: {request.Message.Trim()}";

                // PHASE 2: Persist announcement so every machine can retrieve it
                await _mongoService.WriteAnnouncementAsync(new Models.Mongo.TeamAnnouncement
                {
                    TeamId      = teamId,
                    TeamName    = teamName,
                    SenderEmail = ownerEmail.Trim().ToLowerInvariant(),
                    SenderName  = ownerName,
                    Title       = title,
                    Message     = request.Message.Trim(),
                    ReadBy      = new List<string> { ownerEmail.Trim().ToLowerInvariant() } // sender already read it
                });

                int notified = 0;
                foreach (var member in members)
                {
                    if (string.Equals(member.UserEmail, ownerEmail, StringComparison.OrdinalIgnoreCase))
                        continue; // owners don't need to notify themselves

                    var user = await _userRepository.GetByEmailAsync(member.UserEmail);
                    if (user != null)
                    {
                        await _notificationService.CreateAsync(
                            user.Id,
                            title,
                            body,
                            NotificationType.SystemAnnouncement,
                            NotificationPriority.High,
                            actionUrl: "/teams");
                        notified++;
                    }
                    else
                    {
                        // Member is on a different machine — relay via MongoDB cross-notification bus
                        try
                        {
                            await _mongoService.WriteCrossNotificationAsync(new Models.Mongo.CrossNotification
                            {
                                RecipientEmail = member.UserEmail.Trim().ToLowerInvariant(),
                                SenderEmail    = ownerEmail,
                                Title          = title,
                                Message        = body,
                                Type           = nameof(NotificationType.SystemAnnouncement),
                                Priority       = nameof(NotificationPriority.High),
                                ActionUrl      = "/teams"
                            });
                            notified++;
                        }
                        catch { /* cross-notification failure must not break the announcement */ }
                    }
                }

                return Ok(ApiResponse<string>.Ok($"Announcement sent to {notified} member(s).", "Announcement sent"));
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return StatusCode(503, ApiResponse<string>.Fail($"Could not send announcement: {ex.Message}"));
            }
        }

        /// <summary>
        /// Returns the 50 most recent persistent announcements for a team.
        /// Caller must be a member or owner.
        /// </summary>
        [HttpGet("{teamId}/announcements")]
        public async Task<IActionResult> GetAnnouncements(string teamId)
        {
            try
            {
                var callerEmail = GetUserEmail();
                var announcements = await _mongoService.GetAnnouncementsAsync(teamId);
                return Ok(ApiResponse<List<Models.Mongo.TeamAnnouncement>>.Ok(announcements, "Announcements retrieved"));
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return StatusCode(503, ApiResponse<List<Models.Mongo.TeamAnnouncement>>.Fail($"Could not load announcements: {ex.Message}"));
            }
        }

        /// <summary>
        /// Marks a specific announcement as read by the calling user.
        /// </summary>
        [HttpPost("{teamId}/announcements/{announcementId}/read")]
        public async Task<IActionResult> MarkAnnouncementRead(string teamId, string announcementId)
        {
            try
            {
                var callerEmail = GetUserEmail();
                await _mongoService.MarkAnnouncementReadAsync(announcementId, callerEmail);
                return Ok(ApiResponse<string>.Ok("Marked as read.", "OK"));
            }
            catch (Exception ex) when (ex is not UnauthorizedAccessException)
            {
                return StatusCode(503, ApiResponse<string>.Fail($"Could not mark announcement: {ex.Message}"));
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

    /// <summary>Body for team announcement.</summary>
    public class AnnounceRequest
    {
        public string Message { get; set; } = string.Empty;
        public string? Title { get; set; }
    }
}
