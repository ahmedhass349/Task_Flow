using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using taskflow.DTOs.Mongo;
using taskflow.Models.Mongo;
using taskflow.Services.Interfaces;

namespace taskflow.Services
{
    /// <summary>
    /// Shared MongoDB relay service for cross-device team invitations and presence.
    /// All operations are wrapped in try/catch so MongoDB failure never crashes the app.
    /// </summary>
    public class MongoService : IMongoService
    {
        private const string ConnectionString =
            "mongodb://ahmedabdelbarr2003_db_user:buYRySH3L2hIS5Fm@ac-omzibpf-shard-00-00.zmsrng7.mongodb.net:27017,ac-omzibpf-shard-00-01.zmsrng7.mongodb.net:27017,ac-omzibpf-shard-00-02.zmsrng7.mongodb.net:27017/?ssl=true&replicaSet=atlas-k8r7te-shard-0&authSource=admin";
        private const string DatabaseName = "TaskFlow";

        private readonly IMongoCollection<UserPresence>? _presenceCollection;
        private readonly IMongoCollection<TeamInvitation>? _invitationsCollection;
        private readonly IMongoCollection<MongoTeamMember>? _membersCollection;
        private readonly ILogger<MongoService> _logger;
        private IMongoClient? _client;
        private IMongoDatabase? _db;

        public MongoService(ILogger<MongoService> logger)
        {
            _logger = logger;
            try
            {
                var settings = MongoClientSettings.FromConnectionString(ConnectionString);
                settings.ServerSelectionTimeout = TimeSpan.FromSeconds(10);
                settings.ConnectTimeout = TimeSpan.FromSeconds(10);

                _client = new MongoClient(settings);
                var db = _client.GetDatabase(DatabaseName);
                _db = db;

                _presenceCollection = db.GetCollection<UserPresence>("user_presence");
                _invitationsCollection = db.GetCollection<TeamInvitation>("team_invitations");
                _membersCollection = db.GetCollection<MongoTeamMember>("team_members");

                EnsureIndexesAsync().GetAwaiter().GetResult();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "MongoService: failed to connect to MongoDB. Invitation features will be unavailable.");
            }
        }

        private async Task EnsureIndexesAsync()
        {
            if (_presenceCollection == null) return;

            // Unique index on email for presence
            var presenceEmailIndex = Builders<UserPresence>.IndexKeys.Ascending(u => u.Email);
            await _presenceCollection.Indexes.CreateOneAsync(
                new CreateIndexModel<UserPresence>(presenceEmailIndex,
                    new CreateIndexOptions { Unique = true, Name = "email_unique" }));

            // Compound index on invitations for fast lookups
            if (_invitationsCollection != null)
            {
                var recipientIdx = Builders<TeamInvitation>.IndexKeys
                    .Ascending(i => i.RecipientEmail)
                    .Ascending(i => i.Status);
                await _invitationsCollection.Indexes.CreateOneAsync(
                    new CreateIndexModel<TeamInvitation>(recipientIdx, new CreateIndexOptions { Name = "recipient_status" }));

                var senderIdx = Builders<TeamInvitation>.IndexKeys
                    .Ascending(i => i.SenderEmail)
                    .Ascending(i => i.Status);
                await _invitationsCollection.Indexes.CreateOneAsync(
                    new CreateIndexModel<TeamInvitation>(senderIdx, new CreateIndexOptions { Name = "sender_status" }));
            }

            // Index on team members for fast team lookups
            if (_membersCollection != null)
            {
                var teamIdx = Builders<MongoTeamMember>.IndexKeys
                    .Ascending(m => m.TeamId)
                    .Ascending(m => m.OwnerEmail);
                await _membersCollection.Indexes.CreateOneAsync(
                    new CreateIndexModel<MongoTeamMember>(teamIdx, new CreateIndexOptions { Name = "team_owner" }));
            }
        }

        // ── Generic entity mirror ─────────────────────────────────────────────

        /// <summary>
        /// Upserts any entity into the named collection using its SQLite int ID as _id.
        /// </summary>
        internal async Task UpsertDocumentAsync(string collectionName, int id, MongoDB.Bson.BsonDocument doc)
        {
            if (_db == null) return;
            try
            {
                doc["_id"] = id;
                var collection = _db.GetCollection<MongoDB.Bson.BsonDocument>(collectionName);
                var filter = MongoDB.Driver.Builders<MongoDB.Bson.BsonDocument>.Filter.Eq("_id", id);
                await collection.ReplaceOneAsync(filter, doc,
                    new MongoDB.Driver.ReplaceOptions { IsUpsert = true });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "UpsertDocumentAsync failed: col={Col} id={Id}", collectionName, id);
            }
        }

        /// <summary>
        /// Deletes a document by its SQLite int ID from the named collection.
        /// </summary>
        internal async Task DeleteDocumentAsync(string collectionName, int id)
        {
            if (_db == null) return;
            try
            {
                var collection = _db.GetCollection<MongoDB.Bson.BsonDocument>(collectionName);
                var filter = MongoDB.Driver.Builders<MongoDB.Bson.BsonDocument>.Filter.Eq("_id", id);
                await collection.DeleteOneAsync(filter);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "DeleteDocumentAsync failed: col={Col} id={Id}", collectionName, id);
            }
        }

        // ── Connectivity ping ─────────────────────────────────────────────────

        /// <summary>
        /// Pings the MongoDB admin database with a 5-second timeout.
        /// Returns true when MongoDB is reachable.
        /// </summary>
        internal async Task<bool> PingAsync(CancellationToken ct = default)
        {
            if (_client == null) return false;
            try
            {
                using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
                cts.CancelAfter(TimeSpan.FromSeconds(5));
                await _client.GetDatabase("admin")
                    .RunCommandAsync<MongoDB.Bson.BsonDocument>(
                        new MongoDB.Bson.BsonDocument("ping", 1),
                        cancellationToken: cts.Token);
                return true;
            }
            catch
            {
                return false;
            }
        }

        // ── Presence ──────────────────────────────────────────────────────────

        public async Task UpsertPresenceAsync(string email, string fullName, string avatarUrl)
        {
            if (_presenceCollection == null) return;
            try
            {
                var filter = Builders<UserPresence>.Filter.Eq(u => u.Email, email);
                var update = Builders<UserPresence>.Update
                    .Set(u => u.Email, email)
                    .Set(u => u.FullName, fullName)
                    .Set(u => u.AvatarUrl, avatarUrl ?? string.Empty)
                    .Set(u => u.LastSeen, DateTime.UtcNow)
                    .SetOnInsert(u => u.RegisteredAt, DateTime.UtcNow)
                    .SetOnInsert(u => u.AcceptsInvitations, true);

                await _presenceCollection.UpdateOneAsync(filter, update,
                    new UpdateOptions { IsUpsert = true });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "MongoService.UpsertPresenceAsync failed for {Email}", email);
            }
        }

        public async Task<List<UserSearchResultDto>> SearchUsersAsync(string query, string excludeEmail)
        {
            if (_presenceCollection == null)
                return [];
            try
            {
                var normalizedQuery = query?.Trim() ?? string.Empty;
                if (string.IsNullOrEmpty(normalizedQuery))
                    return [];

                var filter = Builders<UserPresence>.Filter.And(
                    Builders<UserPresence>.Filter.Ne(u => u.Email, excludeEmail),
                    Builders<UserPresence>.Filter.Eq(u => u.AcceptsInvitations, true),
                    Builders<UserPresence>.Filter.Or(
                        Builders<UserPresence>.Filter.Regex(u => u.Email,
                            new MongoDB.Bson.BsonRegularExpression(normalizedQuery, "i")),
                        Builders<UserPresence>.Filter.Regex(u => u.FullName,
                            new MongoDB.Bson.BsonRegularExpression(normalizedQuery, "i"))
                    )
                );

                var results = await _presenceCollection.Find(filter).Limit(20).ToListAsync();
                return results.ConvertAll(u => new UserSearchResultDto
                {
                    Email = u.Email,
                    FullName = u.FullName,
                    AvatarUrl = u.AvatarUrl,
                    AcceptsInvitations = u.AcceptsInvitations,
                });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "MongoService.SearchUsersAsync failed for query '{Query}'", query);
                return [];
            }
        }

        // ── Invitations ───────────────────────────────────────────────────────

        public async Task<TeamInvitation> SendInvitationAsync(
            string senderUserId, string senderEmail, string senderFullName, string senderAvatarUrl,
            SendInvitationRequestDto request)
        {
            if (_invitationsCollection == null)
                throw new InvalidOperationException("MongoDB is unavailable.");

            // Expire any pre-existing pending invitation from the same sender to the same recipient for the same team
            var expireFilter = Builders<TeamInvitation>.Filter.And(
                Builders<TeamInvitation>.Filter.Eq(i => i.SenderEmail, senderEmail),
                Builders<TeamInvitation>.Filter.Eq(i => i.RecipientEmail, request.RecipientEmail),
                Builders<TeamInvitation>.Filter.Eq(i => i.TeamId, request.TeamId),
                Builders<TeamInvitation>.Filter.Eq(i => i.Status, InvitationStatus.Pending)
            );
            await _invitationsCollection.UpdateManyAsync(expireFilter,
                Builders<TeamInvitation>.Update.Set(i => i.Status, InvitationStatus.Expired));

            var invitation = new TeamInvitation
            {
                SenderUserId = senderUserId,
                SenderEmail = senderEmail,
                SenderFullName = senderFullName,
                SenderAvatarUrl = senderAvatarUrl ?? string.Empty,
                RecipientEmail = request.RecipientEmail.Trim().ToLowerInvariant(),
                TeamId = request.TeamId,
                TeamName = request.TeamName,
                Message = request.Message ?? string.Empty,
                Role = request.Role ?? "Member",
                Status = InvitationStatus.Pending,
                SentAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(30),
            };

            await _invitationsCollection.InsertOneAsync(invitation);

            // Auto-upsert the sender as Admin in their own team
            if (!string.IsNullOrEmpty(request.TeamId) && _membersCollection != null)
            {
                var senderFilter = Builders<MongoTeamMember>.Filter.And(
                    Builders<MongoTeamMember>.Filter.Eq(m => m.TeamId, request.TeamId),
                    Builders<MongoTeamMember>.Filter.Eq(m => m.UserEmail, senderEmail),
                    Builders<MongoTeamMember>.Filter.Eq(m => m.OwnerEmail, senderEmail)
                );
                var senderUpdate = Builders<MongoTeamMember>.Update
                    .Set(m => m.UserEmail, senderEmail)
                    .Set(m => m.UserFullName, senderFullName)
                    .Set(m => m.Role, "Admin")
                    .Set(m => m.TeamId, request.TeamId)
                    .Set(m => m.TeamName, request.TeamName ?? string.Empty)
                    .Set(m => m.OwnerEmail, senderEmail)
                    .Set(m => m.IsActive, true)
                    .SetOnInsert(m => m.JoinedAt, DateTime.UtcNow);
                await _membersCollection.UpdateOneAsync(senderFilter, senderUpdate,
                    new UpdateOptions { IsUpsert = true });
            }

            return invitation;
        }

        public async Task<List<InvitationResponseDto>> GetIncomingInvitationsAsync(string recipientEmail)
        {
            if (_invitationsCollection == null) return [];
            try
            {
                var now = DateTime.UtcNow;
                var filter = Builders<TeamInvitation>.Filter.And(
                    Builders<TeamInvitation>.Filter.Eq(i => i.RecipientEmail, recipientEmail),
                    Builders<TeamInvitation>.Filter.In(i => i.Status,
                        new[] { InvitationStatus.Pending, InvitationStatus.Accepted, InvitationStatus.Declined })
                );

                var invitations = await _invitationsCollection
                    .Find(filter)
                    .SortByDescending(i => i.SentAt)
                    .Limit(50)
                    .ToListAsync();

                return invitations.ConvertAll(ToDto);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "MongoService.GetIncomingInvitationsAsync failed for {Email}", recipientEmail);
                return [];
            }
        }

        public async Task<List<InvitationResponseDto>> GetOutgoingInvitationsAsync(string senderEmail)
        {
            if (_invitationsCollection == null) return [];
            try
            {
                var filter = Builders<TeamInvitation>.Filter.And(
                    Builders<TeamInvitation>.Filter.Eq(i => i.SenderEmail, senderEmail),
                    Builders<TeamInvitation>.Filter.In(i => i.Status,
                        new[] { InvitationStatus.Pending, InvitationStatus.Accepted, InvitationStatus.Declined, InvitationStatus.Cancelled })
                );

                var invitations = await _invitationsCollection
                    .Find(filter)
                    .SortByDescending(i => i.SentAt)
                    .Limit(50)
                    .ToListAsync();

                return invitations.ConvertAll(ToDto);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "MongoService.GetOutgoingInvitationsAsync failed for {Email}", senderEmail);
                return [];
            }
        }

        public async Task<TeamInvitation> AcceptInvitationAsync(string invitationId, string recipientEmail)
        {
            if (_invitationsCollection == null || _membersCollection == null)
                throw new InvalidOperationException("MongoDB is unavailable.");

            var filter = Builders<TeamInvitation>.Filter.And(
                Builders<TeamInvitation>.Filter.Eq(i => i.Id, invitationId),
                Builders<TeamInvitation>.Filter.Eq(i => i.RecipientEmail, recipientEmail),
                Builders<TeamInvitation>.Filter.Eq(i => i.Status, InvitationStatus.Pending)
            );

            var update = Builders<TeamInvitation>.Update
                .Set(i => i.Status, InvitationStatus.Accepted)
                .Set(i => i.RespondedAt, DateTime.UtcNow);

            var invitation = await _invitationsCollection.FindOneAndUpdateAsync(filter, update,
                new FindOneAndUpdateOptions<TeamInvitation> { ReturnDocument = ReturnDocument.After });

            if (invitation == null)
                throw new KeyNotFoundException("Invitation not found or already responded to.");

            // Only add recipient to team_members when the invitation is for a specific team
            if (!string.IsNullOrEmpty(invitation.TeamId))
            {
                var memberFilter = Builders<MongoTeamMember>.Filter.And(
                    Builders<MongoTeamMember>.Filter.Eq(m => m.TeamId, invitation.TeamId ?? string.Empty),
                    Builders<MongoTeamMember>.Filter.Eq(m => m.UserEmail, recipientEmail),
                    Builders<MongoTeamMember>.Filter.Eq(m => m.OwnerEmail, invitation.SenderEmail)
                );
                var memberUpdate = Builders<MongoTeamMember>.Update
                    .Set(m => m.TeamId, invitation.TeamId ?? string.Empty)
                    .Set(m => m.TeamName, invitation.TeamName ?? string.Empty)
                    .Set(m => m.UserEmail, recipientEmail)
                    .Set(m => m.UserFullName, invitation.RecipientFullName)
                    .Set(m => m.Role, invitation.Role)
                    .Set(m => m.OwnerEmail, invitation.SenderEmail)
                    .Set(m => m.IsActive, true)
                    .SetOnInsert(m => m.JoinedAt, DateTime.UtcNow);

                await _membersCollection.UpdateOneAsync(memberFilter, memberUpdate,
                    new UpdateOptions { IsUpsert = true });
            }

            return invitation;
        }

        public async Task<TeamInvitation> DeclineInvitationAsync(string invitationId, string recipientEmail, string? reason)
        {
            if (_invitationsCollection == null)
                throw new InvalidOperationException("MongoDB is unavailable.");

            var filter = Builders<TeamInvitation>.Filter.And(
                Builders<TeamInvitation>.Filter.Eq(i => i.Id, invitationId),
                Builders<TeamInvitation>.Filter.Eq(i => i.RecipientEmail, recipientEmail),
                Builders<TeamInvitation>.Filter.Eq(i => i.Status, InvitationStatus.Pending)
            );

            var update = Builders<TeamInvitation>.Update
                .Set(i => i.Status, InvitationStatus.Declined)
                .Set(i => i.RespondedAt, DateTime.UtcNow)
                .Set(i => i.DeclineReason, reason ?? string.Empty);

            var invitation = await _invitationsCollection.FindOneAndUpdateAsync(filter, update,
                new FindOneAndUpdateOptions<TeamInvitation> { ReturnDocument = ReturnDocument.After });

            if (invitation == null)
                throw new KeyNotFoundException("Invitation not found or already responded to.");

            return invitation;
        }

        public async Task CancelInvitationAsync(string invitationId, string senderEmail)
        {
            if (_invitationsCollection == null)
                throw new InvalidOperationException("MongoDB is unavailable.");

            var filter = Builders<TeamInvitation>.Filter.And(
                Builders<TeamInvitation>.Filter.Eq(i => i.Id, invitationId),
                Builders<TeamInvitation>.Filter.Eq(i => i.SenderEmail, senderEmail),
                Builders<TeamInvitation>.Filter.Eq(i => i.Status, InvitationStatus.Pending)
            );

            var update = Builders<TeamInvitation>.Update
                .Set(i => i.Status, InvitationStatus.Cancelled)
                .Set(i => i.RespondedAt, DateTime.UtcNow);

            var result = await _invitationsCollection.UpdateOneAsync(filter, update);
            if (result.MatchedCount == 0)
                throw new KeyNotFoundException("Invitation not found or already responded to.");
        }

        // ── Team members ──────────────────────────────────────────────────────

        public async Task<List<MongoTeamMemberDto>> GetTeamMembersAsync(string teamId, string ownerEmail)
        {
            if (_membersCollection == null) return [];
            try
            {
                var filter = Builders<MongoTeamMember>.Filter.And(
                    Builders<MongoTeamMember>.Filter.Eq(m => m.TeamId, teamId),
                    Builders<MongoTeamMember>.Filter.Eq(m => m.OwnerEmail, ownerEmail),
                    Builders<MongoTeamMember>.Filter.Eq(m => m.IsActive, true)
                );

                var members = await _membersCollection.Find(filter).ToListAsync();
                return members.ConvertAll(m => new MongoTeamMemberDto
                {
                    Id = m.Id ?? string.Empty,
                    TeamId = m.TeamId,
                    TeamName = m.TeamName,
                    UserEmail = m.UserEmail,
                    UserFullName = m.UserFullName,
                    AvatarUrl = m.AvatarUrl,
                    Role = m.Role,
                    OwnerEmail = m.OwnerEmail,
                    JoinedAt = m.JoinedAt,
                    IsActive = m.IsActive,
                });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "MongoService.GetTeamMembersAsync failed for teamId={TeamId}", teamId);
                return [];
            }
        }

        public async Task<List<MongoTeamMemberDto>> GetAllTeamMembersAsync(string ownerEmail)
        {
            if (_membersCollection == null) return [];
            try
            {
                var filter = Builders<MongoTeamMember>.Filter.And(
                    Builders<MongoTeamMember>.Filter.Eq(m => m.OwnerEmail, ownerEmail),
                    Builders<MongoTeamMember>.Filter.Eq(m => m.IsActive, true)
                );

                var members = await _membersCollection.Find(filter)
                    .SortByDescending(m => m.JoinedAt)
                    .ToListAsync();
                return members.ConvertAll(m => new MongoTeamMemberDto
                {
                    Id = m.Id ?? string.Empty,
                    TeamId = m.TeamId,
                    TeamName = m.TeamName,
                    UserEmail = m.UserEmail,
                    UserFullName = m.UserFullName,
                    AvatarUrl = m.AvatarUrl,
                    Role = m.Role,
                    OwnerEmail = m.OwnerEmail,
                    JoinedAt = m.JoinedAt,
                    IsActive = m.IsActive,
                });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "MongoService.GetAllTeamMembersAsync failed for {Email}", ownerEmail);
                return [];
            }
        }

        public async Task RemoveTeamMemberAsync(string teamId, string memberEmail, string ownerEmail)
        {
            if (_membersCollection == null)
                throw new InvalidOperationException("MongoDB is unavailable.");

            var filter = Builders<MongoTeamMember>.Filter.And(
                Builders<MongoTeamMember>.Filter.Eq(m => m.TeamId, teamId),
                Builders<MongoTeamMember>.Filter.Eq(m => m.UserEmail, memberEmail),
                Builders<MongoTeamMember>.Filter.Eq(m => m.OwnerEmail, ownerEmail)
            );

            var result = await _membersCollection.UpdateOneAsync(filter,
                Builders<MongoTeamMember>.Update.Set(m => m.IsActive, false));

            if (result.MatchedCount == 0)
                throw new KeyNotFoundException("Team member not found.");
        }

        public async Task RemoveAllMemberRecordsAsync(string memberEmail, string ownerEmail)
        {
            if (_membersCollection == null)
                throw new InvalidOperationException("MongoDB is unavailable.");

            var filter = Builders<MongoTeamMember>.Filter.And(
                Builders<MongoTeamMember>.Filter.Eq(m => m.UserEmail, memberEmail),
                Builders<MongoTeamMember>.Filter.Eq(m => m.OwnerEmail, ownerEmail)
            );

            await _membersCollection.UpdateManyAsync(filter,
                Builders<MongoTeamMember>.Update.Set(m => m.IsActive, false));
        }

        public async Task<MongoTeamMemberDto> AddMemberToTeamAsync(
            string ownerEmail, string memberEmail, string memberFullName,
            string targetTeamId, string targetTeamName, string role = "Member")
        {
            if (_membersCollection == null)
                throw new InvalidOperationException("MongoDB is unavailable.");

            var filter = Builders<MongoTeamMember>.Filter.And(
                Builders<MongoTeamMember>.Filter.Eq(m => m.TeamId, targetTeamId),
                Builders<MongoTeamMember>.Filter.Eq(m => m.UserEmail, memberEmail),
                Builders<MongoTeamMember>.Filter.Eq(m => m.OwnerEmail, ownerEmail)
            );

            var update = Builders<MongoTeamMember>.Update
                .Set(m => m.TeamId, targetTeamId)
                .Set(m => m.TeamName, targetTeamName)
                .Set(m => m.UserEmail, memberEmail)
                .Set(m => m.UserFullName, memberFullName)
                .Set(m => m.OwnerEmail, ownerEmail)
                .Set(m => m.IsActive, true)
                .SetOnInsert(m => m.Role, role)
                .SetOnInsert(m => m.JoinedAt, DateTime.UtcNow);

            var opts = new FindOneAndUpdateOptions<MongoTeamMember>
            {
                IsUpsert = true,
                ReturnDocument = ReturnDocument.After
            };

            var member = await _membersCollection.FindOneAndUpdateAsync(filter, update, opts);
            return new MongoTeamMemberDto
            {
                Id = member.Id ?? string.Empty,
                TeamId = member.TeamId,
                TeamName = member.TeamName,
                UserEmail = member.UserEmail,
                UserFullName = member.UserFullName,
                AvatarUrl = member.AvatarUrl,
                Role = member.Role,
                OwnerEmail = member.OwnerEmail,
                JoinedAt = member.JoinedAt,
                IsActive = member.IsActive,
            };
        }

        public async Task<List<MongoTeamMemberDto>> DeleteTeamMembersAsync(string teamId)
        {
            if (_membersCollection == null) return [];
            var filter = Builders<MongoTeamMember>.Filter.Eq(m => m.TeamId, teamId);
            var members = await _membersCollection.Find(filter).ToListAsync();
            if (members.Count > 0)
                await _membersCollection.DeleteManyAsync(filter);
            return members.ConvertAll(m => new MongoTeamMemberDto
            {
                Id = m.Id ?? string.Empty,
                TeamId = m.TeamId,
                TeamName = m.TeamName,
                UserEmail = m.UserEmail,
                UserFullName = m.UserFullName,
                AvatarUrl = m.AvatarUrl,
                Role = m.Role,
                OwnerEmail = m.OwnerEmail,
                JoinedAt = m.JoinedAt,
                IsActive = m.IsActive,
            });
        }

        public async Task DeleteInvitationAsync(string invitationId, string ownerEmail)
        {
            if (_invitationsCollection == null)
                throw new InvalidOperationException("MongoDB is unavailable.");

            var filter = Builders<TeamInvitation>.Filter.And(
                Builders<TeamInvitation>.Filter.Eq(i => i.Id, invitationId),
                Builders<TeamInvitation>.Filter.Or(
                    Builders<TeamInvitation>.Filter.Eq(i => i.SenderEmail, ownerEmail),
                    Builders<TeamInvitation>.Filter.Eq(i => i.RecipientEmail, ownerEmail)
                )
            );

            var result = await _invitationsCollection.DeleteOneAsync(filter);
            if (result.DeletedCount == 0)
                throw new KeyNotFoundException("Invitation not found.");
        }

        public async Task<List<MongoTeamMemberDto>> GetMembershipsByUserAsync(string userEmail)
        {
            if (_membersCollection == null) return [];
            try
            {
                var filter = Builders<MongoTeamMember>.Filter.And(
                    Builders<MongoTeamMember>.Filter.Eq(m => m.UserEmail, userEmail),
                    Builders<MongoTeamMember>.Filter.Ne(m => m.OwnerEmail, userEmail),
                    Builders<MongoTeamMember>.Filter.Eq(m => m.IsActive, true),
                    Builders<MongoTeamMember>.Filter.Ne(m => m.TeamId, null),
                    Builders<MongoTeamMember>.Filter.Ne(m => m.TeamId, string.Empty)
                );
                var members = await _membersCollection.Find(filter)
                    .SortByDescending(m => m.JoinedAt)
                    .ToListAsync();
                return members.ConvertAll(m => new MongoTeamMemberDto
                {
                    Id = m.Id ?? string.Empty,
                    TeamId = m.TeamId,
                    TeamName = m.TeamName,
                    UserEmail = m.UserEmail,
                    UserFullName = m.UserFullName,
                    AvatarUrl = m.AvatarUrl,
                    Role = m.Role,
                    OwnerEmail = m.OwnerEmail,
                    JoinedAt = m.JoinedAt,
                    IsActive = m.IsActive,
                });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "MongoService.GetMembershipsByUserAsync failed for {Email}", userEmail);
                return [];
            }
        }

        public async Task LeaveTeamAsync(string teamId, string userEmail)
        {
            if (_membersCollection == null)
                throw new InvalidOperationException("MongoDB is unavailable.");

            var filter = Builders<MongoTeamMember>.Filter.And(
                Builders<MongoTeamMember>.Filter.Eq(m => m.TeamId, teamId),
                Builders<MongoTeamMember>.Filter.Eq(m => m.UserEmail, userEmail)
            );
            var result = await _membersCollection.UpdateOneAsync(filter,
                Builders<MongoTeamMember>.Update.Set(m => m.IsActive, false));

            if (result.MatchedCount == 0)
                throw new KeyNotFoundException("Team membership not found.");
        }

        // ── Helpers ───────────────────────────────────────────────────────────

        private static InvitationResponseDto ToDto(TeamInvitation i) => new()
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

        // ── Dev / testing ─────────────────────────────────────────────────────

        /// <summary>Drops every document from all three MongoDB collections.</summary>
        public async Task ClearAllAsync()
        {
            var empty = Builders<MongoDB.Bson.BsonDocument>.Filter.Empty;
            if (_presenceCollection != null)
                await _db!.GetCollection<MongoDB.Bson.BsonDocument>("user_presence").DeleteManyAsync(empty);
            if (_invitationsCollection != null)
                await _db!.GetCollection<MongoDB.Bson.BsonDocument>("team_invitations").DeleteManyAsync(empty);
            if (_membersCollection != null)
                await _db!.GetCollection<MongoDB.Bson.BsonDocument>("team_members").DeleteManyAsync(empty);
        }
    }
}
