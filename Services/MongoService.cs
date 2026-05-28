using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
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
        private const string DatabaseName = "TaskFlow";

        private readonly IMongoCollection<UserPresence>? _presenceCollection;
        private readonly IMongoCollection<TeamInvitation>? _invitationsCollection;
        private readonly IMongoCollection<MongoTeamMember>? _membersCollection;
        private readonly IMongoCollection<CrossNotification>? _crossNotificationsCollection;
        private readonly IMongoCollection<UserAccount>? _userAccountsCollection;
        private readonly IMongoCollection<TeamAnnouncement>? _announcementsCollection;
        private readonly ILogger<MongoService> _logger;
        private IMongoClient? _client;
        private IMongoDatabase? _db;

        public MongoService(ILogger<MongoService> logger, IConfiguration configuration)
        {
            _logger = logger;
            // Connection string read from env var first (never checked into source),
            // then falls back to appsettings MongoDB:ConnectionString.
            var connectionString = Environment.GetEnvironmentVariable("TASKFLOW_MONGO_URI")
                                   ?? configuration["MongoDB:ConnectionString"]
                                   ?? string.Empty;
            try
            {
                var settings = MongoClientSettings.FromConnectionString(connectionString);
                settings.ServerSelectionTimeout = TimeSpan.FromSeconds(8);
                settings.ConnectTimeout = TimeSpan.FromSeconds(8);
                settings.SocketTimeout = TimeSpan.FromSeconds(15);
                settings.HeartbeatInterval = TimeSpan.FromSeconds(10);
                settings.RetryWrites = true;
                settings.RetryReads = true;
                settings.MaxConnectionPoolSize = 10;
                settings.MinConnectionPoolSize = 1;
                settings.MaxConnectionIdleTime = TimeSpan.FromMinutes(5);

                _client = new MongoClient(settings);
                var db = _client.GetDatabase(DatabaseName);
                _db = db;

                _presenceCollection = db.GetCollection<UserPresence>("user_presence");
                _invitationsCollection = db.GetCollection<TeamInvitation>("team_invitations");
                _membersCollection = db.GetCollection<MongoTeamMember>("team_members");
                _crossNotificationsCollection = db.GetCollection<CrossNotification>("cross_notifications");
                _userAccountsCollection = db.GetCollection<UserAccount>("user_accounts");
                _announcementsCollection = db.GetCollection<TeamAnnouncement>("team_announcements");

                // B-02: fire-and-forget index creation — never block the DI constructor thread.
                _ = Task.Run(async () =>
                {
                    try { await EnsureIndexesAsync(); }
                    catch (Exception ex) { _logger.LogWarning(ex, "MongoService: index creation failed (non-critical)."); }
                    try { await NormalizeTeamMemberRolesAsync(); }
                    catch (Exception ex) { _logger.LogWarning(ex, "MongoService: role normalization failed (non-critical)."); }
                });
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

                // DB-07: TTL index — MongoDB auto-deletes invitation documents once ExpiresAt is reached.
                var ttlKey = Builders<TeamInvitation>.IndexKeys.Ascending(i => i.ExpiresAt);
                await _invitationsCollection.Indexes.CreateOneAsync(
                    new CreateIndexModel<TeamInvitation>(ttlKey,
                        new CreateIndexOptions { Name = "expires_ttl", ExpireAfter = TimeSpan.Zero }));
            }

            // Index on team members for fast team lookups
            if (_membersCollection != null)
            {
                var teamIdx = Builders<MongoTeamMember>.IndexKeys
                    .Ascending(m => m.TeamId)
                    .Ascending(m => m.OwnerEmail);
                await _membersCollection.Indexes.CreateOneAsync(
                    new CreateIndexModel<MongoTeamMember>(teamIdx, new CreateIndexOptions { Name = "team_owner" }));

                // Index on UserEmail — needed for GetMembershipsByUserAsync (prevents full collection scan)
                var userEmailIdx = Builders<MongoTeamMember>.IndexKeys
                    .Ascending(m => m.UserEmail)
                    .Ascending(m => m.IsActive);
                await _membersCollection.Indexes.CreateOneAsync(
                    new CreateIndexModel<MongoTeamMember>(userEmailIdx, new CreateIndexOptions { Name = "member_user_email" }));

                // H-03: unique compound index prevents duplicate membership records
                var memberUniqueIdx = Builders<MongoTeamMember>.IndexKeys
                    .Ascending(m => m.TeamId)
                    .Ascending(m => m.UserEmail)
                    .Ascending(m => m.OwnerEmail);
                await _membersCollection.Indexes.CreateOneAsync(
                    new CreateIndexModel<MongoTeamMember>(memberUniqueIdx,
                        new CreateIndexOptions { Unique = true, Name = "member_unique_teamId_user_owner" }));
            }

            // C-01: index on Username for fast username-based search
            var usernameIdx = Builders<UserPresence>.IndexKeys.Ascending(u => u.Username);
            await _presenceCollection.Indexes.CreateOneAsync(
                new CreateIndexModel<UserPresence>(usernameIdx, new CreateIndexOptions { Name = "username_idx" }));

            // L-02: TTL index on cross_notifications so MongoDB auto-expires stale documents
            if (_crossNotificationsCollection != null)
            {
                var crossTtlKey = Builders<CrossNotification>.IndexKeys.Ascending(n => n.ExpiresAt);
                await _crossNotificationsCollection.Indexes.CreateOneAsync(
                    new CreateIndexModel<CrossNotification>(crossTtlKey,
                        new CreateIndexOptions { Name = "cross_notif_expires_ttl", ExpireAfter = TimeSpan.Zero }));

                var crossRecipIdx = Builders<CrossNotification>.IndexKeys.Ascending(n => n.RecipientEmail);
                await _crossNotificationsCollection.Indexes.CreateOneAsync(
                    new CreateIndexModel<CrossNotification>(crossRecipIdx,
                        new CreateIndexOptions { Name = "cross_notif_recipient" }));
            }

            // Unique email index for user_accounts credential backup
            if (_userAccountsCollection != null)
            {
                var accountEmailIdx = Builders<UserAccount>.IndexKeys.Ascending(a => a.Email);
                await _userAccountsCollection.Indexes.CreateOneAsync(
                    new CreateIndexModel<UserAccount>(accountEmailIdx,
                        new CreateIndexOptions { Unique = true, Name = "account_email_unique" }));
            }

            // Compound index for team_announcements (teamId + createdAt desc)
            if (_announcementsCollection != null)
            {
                var annIdx = Builders<TeamAnnouncement>.IndexKeys
                    .Ascending(a => a.TeamId)
                    .Descending(a => a.CreatedAt);
                await _announcementsCollection.Indexes.CreateOneAsync(
                    new CreateIndexModel<TeamAnnouncement>(annIdx,
                        new CreateIndexOptions { Name = "ann_teamid_createdat" }));
            }
        }

        private async Task NormalizeTeamMemberRolesAsync()
        {
            if (_membersCollection == null) return;
            var filter = Builders<MongoTeamMember>.Filter.Eq(m => m.Role, "Admin");
            var update = Builders<MongoTeamMember>.Update.Set(m => m.Role, "Leader");
            var result = await _membersCollection.UpdateManyAsync(filter, update);
            if (result.ModifiedCount > 0)
                _logger.LogInformation("MongoService: normalized {Count} team_members documents from 'Admin' to 'Leader'.", result.ModifiedCount);
        }

        public async Task<TeamAnnouncement> WriteAnnouncementAsync(TeamAnnouncement announcement)
        {
            if (_announcementsCollection == null) return announcement;
            announcement.CreatedAt = DateTime.UtcNow;
            await _announcementsCollection.InsertOneAsync(announcement);
            return announcement;
        }

        public async Task<List<TeamAnnouncement>> GetAnnouncementsAsync(string teamId, int limit = 50)
        {
            if (_announcementsCollection == null) return new List<TeamAnnouncement>();
            var filter = Builders<TeamAnnouncement>.Filter.Eq(a => a.TeamId, teamId);
            var sort = Builders<TeamAnnouncement>.Sort.Descending(a => a.CreatedAt);
            return await _announcementsCollection.Find(filter).Sort(sort).Limit(limit).ToListAsync();
        }

        public async Task MarkAnnouncementReadAsync(string announcementId, string userEmail)
        {
            if (_announcementsCollection == null) return;
            var normalizedEmail = userEmail.Trim().ToLowerInvariant();
            var filter = Builders<TeamAnnouncement>.Filter.Eq(a => a.Id, announcementId);
            // AddToSet is idempotent — won't add duplicates
            var update = Builders<TeamAnnouncement>.Update.AddToSet(a => a.ReadBy, normalizedEmail);
            await _announcementsCollection.UpdateOneAsync(filter, update);
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


        /// <summary>
        /// Upserts a document using a GUID SyncId as <c>_id</c> (string).
        /// The original SQLite int id is stored as the <c>intId</c> field for legacy reference.
        /// </summary>
        internal async Task UpsertDocumentBySyncIdAsync(
            string collectionName, string syncId, int intId, MongoDB.Bson.BsonDocument doc)
        {
            if (_db == null) return;
            try
            {
                doc["_id"] = syncId;
                doc["intId"] = intId;
                var collection = _db.GetCollection<MongoDB.Bson.BsonDocument>(collectionName);
                var filter = MongoDB.Driver.Builders<MongoDB.Bson.BsonDocument>.Filter.Eq("_id", syncId);
                await collection.ReplaceOneAsync(filter, doc,
                    new MongoDB.Driver.ReplaceOptions { IsUpsert = true });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "UpsertDocumentBySyncIdAsync failed: col={Col} syncId={SyncId}", collectionName, syncId);
            }
        }

        /// <summary>
        /// Deletes a document whose <c>_id</c> is the given GUID string.
        /// </summary>
        internal async Task DeleteDocumentBySyncIdAsync(string collectionName, string syncId)
        {
            if (_db == null) return;
            try
            {
                var collection = _db.GetCollection<MongoDB.Bson.BsonDocument>(collectionName);
                var filter = MongoDB.Driver.Builders<MongoDB.Bson.BsonDocument>.Filter.Eq("_id", syncId);
                await collection.DeleteOneAsync(filter);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "DeleteDocumentBySyncIdAsync failed: col={Col} syncId={SyncId}", collectionName, syncId);
            }
        }

        /// <summary>
        /// Returns all documents in the named collection matching the given filter.
        /// Returns an empty list when MongoDB is unreachable.
        /// </summary>
        internal async Task<List<MongoDB.Bson.BsonDocument>> FindDocumentsAsync(
            string collectionName, MongoDB.Bson.BsonDocument filter, CancellationToken ct = default)
        {
            if (_db == null) return new List<MongoDB.Bson.BsonDocument>();
            try
            {
                var collection = _db.GetCollection<MongoDB.Bson.BsonDocument>(collectionName);
                return await collection.Find(filter).ToListAsync(ct);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "FindDocumentsAsync failed: col={Col}", collectionName);
                return new List<MongoDB.Bson.BsonDocument>();
            }
        }

        /// <summary>
        /// Returns ALL documents in the named collection, or <c>null</c> when MongoDB is
        /// unreachable (distinguishes an error from a genuinely empty collection).
        /// </summary>
        internal async Task<List<MongoDB.Bson.BsonDocument>?> GetAllDocumentsAsync(
            string collectionName, CancellationToken ct = default)
        {
            if (_db == null) return null;
            try
            {
                var collection = _db.GetCollection<MongoDB.Bson.BsonDocument>(collectionName);
                return await collection.Find(new MongoDB.Bson.BsonDocument()).ToListAsync(ct);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "GetAllDocumentsAsync failed: col={Col}", collectionName);
                return null; // null = unreachable; empty list = collection is genuinely empty
            }
        }

        // ── Connectivity ping ─────────────────────────────────────────────────

        /// <summary>
        /// Pings the MongoDB admin database with a 5-second timeout.
        /// Returns true when MongoDB is reachable.
        /// </summary>
        public async Task<bool> PingAsync(CancellationToken ct = default)
        {
            if (_client == null) return false;
            try
            {
                using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
                cts.CancelAfter(TimeSpan.FromSeconds(5));
                await _client.GetDatabase(DatabaseName)
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
                var username = email.Contains('@') ? email.Split('@')[0].ToLowerInvariant() : email.ToLowerInvariant();
                var update = Builders<UserPresence>.Update
                    .Set(u => u.Email, email)
                    .Set(u => u.FullName, fullName)
                    .Set(u => u.AvatarUrl, avatarUrl ?? string.Empty)
                    .Set(u => u.Username, username)
                    .Set(u => u.LastSeen, DateTime.UtcNow)
                    .SetOnInsert(u => u.RegisteredAt, DateTime.UtcNow)
                    .Set(u => u.AcceptsInvitations, true);

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
                            new MongoDB.Bson.BsonRegularExpression(Regex.Escape(normalizedQuery), "i")),
                        Builders<UserPresence>.Filter.Regex(u => u.FullName,
                            new MongoDB.Bson.BsonRegularExpression(Regex.Escape(normalizedQuery), "i")),
                        Builders<UserPresence>.Filter.Regex(u => u.Username,
                            new MongoDB.Bson.BsonRegularExpression(Regex.Escape(normalizedQuery), "i"))
                    )
                );

                var results = await _presenceCollection.Find(filter)
                    .SortByDescending(u => u.LastSeen)
                    .Limit(20).ToListAsync();
                return results.ConvertAll(u => new UserSearchResultDto
                {
                    Email = u.Email,
                    FullName = u.FullName,
                    AvatarUrl = u.AvatarUrl,
                    Username = u.Username,
                    LastSeen = u.LastSeen,
                    AcceptsInvitations = u.AcceptsInvitations,
                });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "MongoService.SearchUsersAsync failed for query '{Query}'", query);
                throw;
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
            var normalizedRecipient = request.RecipientEmail.Trim().ToLowerInvariant();
            var expireFilter = Builders<TeamInvitation>.Filter.And(
                Builders<TeamInvitation>.Filter.Eq(i => i.SenderEmail, senderEmail),
                Builders<TeamInvitation>.Filter.Eq(i => i.RecipientEmail, normalizedRecipient),
                Builders<TeamInvitation>.Filter.Eq(i => i.TeamId, request.TeamId),
                Builders<TeamInvitation>.Filter.Eq(i => i.Status, InvitationStatus.Pending)
            );
            await _invitationsCollection.UpdateManyAsync(expireFilter,
                Builders<TeamInvitation>.Update.Set(i => i.Status, InvitationStatus.Expired));

            // Resolve recipient full name and username from presence; derive both from email as fallback
            string recipientFullName = string.Empty;
            string recipientUsername = normalizedRecipient.Split('@')[0];
            if (_presenceCollection != null)
            {
                try
                {
                    var recipPres = await _presenceCollection
                        .Find(Builders<UserPresence>.Filter.Eq(u => u.Email, normalizedRecipient))
                        .FirstOrDefaultAsync();
                    if (recipPres != null)
                    {
                        if (!string.IsNullOrEmpty(recipPres.FullName))
                            recipientFullName = recipPres.FullName;
                        if (!string.IsNullOrEmpty(recipPres.Username))
                            recipientUsername = recipPres.Username;
                    }
                }
                catch { /* non-critical */ }
            }

            var invitation = new TeamInvitation
            {
                SenderUserId = senderUserId,
                SenderEmail = senderEmail,
                SenderFullName = senderFullName,
                SenderAvatarUrl = senderAvatarUrl ?? string.Empty,
                SenderUsername = senderEmail.Split('@')[0].ToLowerInvariant(),
                RecipientEmail = normalizedRecipient,
                RecipientFullName = recipientFullName,
                RecipientUsername = recipientUsername,
                TeamId = request.TeamId,
                TeamName = request.TeamName,
                Message = request.Message ?? string.Empty,
                Role = request.Role ?? "Member",
                Status = InvitationStatus.Pending,
                SentAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(30),
            };

            await _invitationsCollection.InsertOneAsync(invitation);

            // Auto-upsert the sender as Leader in their own team
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
                    .Set(m => m.AvatarUrl, senderAvatarUrl ?? string.Empty)
                    .Set(m => m.Role, "Leader")
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
                var normalizedEmail = recipientEmail.Trim().ToLowerInvariant();
                var derivedUsername = normalizedEmail.Split('@')[0];
                var filter = Builders<TeamInvitation>.Filter.And(
                    Builders<TeamInvitation>.Filter.Or(
                        Builders<TeamInvitation>.Filter.Eq(i => i.RecipientEmail, normalizedEmail),
                        Builders<TeamInvitation>.Filter.Eq(i => i.RecipientUsername, derivedUsername)
                    ),
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
                Builders<TeamInvitation>.Filter.Eq(i => i.RecipientEmail, recipientEmail.Trim().ToLowerInvariant()),
                Builders<TeamInvitation>.Filter.Eq(i => i.Status, InvitationStatus.Pending)
            );

            var update = Builders<TeamInvitation>.Update
                .Set(i => i.Status, InvitationStatus.Accepted)
                .Set(i => i.RespondedAt, DateTime.UtcNow);

            var invitation = await _invitationsCollection.FindOneAndUpdateAsync(filter, update,
                new FindOneAndUpdateOptions<TeamInvitation> { ReturnDocument = ReturnDocument.After });

            if (invitation == null)
                throw new KeyNotFoundException("Invitation not found or already responded to.");

            // Resolve recipient's display name and avatar from their presence record.
            string recipientFullName = invitation.RecipientFullName;
            string recipientAvatarUrl = string.Empty;
            if (_presenceCollection != null)
            {
                try
                {
                    var pres = await _presenceCollection
                        .Find(Builders<UserPresence>.Filter.Eq(u => u.Email, recipientEmail.Trim().ToLowerInvariant()))
                        .FirstOrDefaultAsync();
                    if (pres != null)
                    {
                        if (string.IsNullOrEmpty(recipientFullName) && !string.IsNullOrEmpty(pres.FullName))
                            recipientFullName = pres.FullName;
                        if (!string.IsNullOrEmpty(pres.AvatarUrl))
                            recipientAvatarUrl = pres.AvatarUrl;
                    }
                }
                catch { /* non-critical */ }
            }
            if (string.IsNullOrEmpty(recipientFullName))
                recipientFullName = recipientEmail;

            // Back-fill RecipientFullName on the invitation document if it was empty when first sent.
            if (!string.IsNullOrEmpty(recipientFullName) && string.IsNullOrEmpty(invitation.RecipientFullName))
            {
                try
                {
                    await _invitationsCollection.UpdateOneAsync(
                        Builders<TeamInvitation>.Filter.Eq(i => i.Id, invitation.Id),
                        Builders<TeamInvitation>.Update.Set(i => i.RecipientFullName, recipientFullName));
                    invitation.RecipientFullName = recipientFullName;
                }
                catch { /* non-critical */ }
            }

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
                    .Set(m => m.UserFullName, recipientFullName)
                    .Set(m => m.AvatarUrl, recipientAvatarUrl)
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
                Builders<TeamInvitation>.Filter.Eq(i => i.RecipientEmail, recipientEmail.Trim().ToLowerInvariant()),
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
                    Builders<MongoTeamMember>.Filter.Eq(m => m.IsActive, true),
                    Builders<MongoTeamMember>.Filter.Ne(m => m.UserEmail, ownerEmail)
                );

                var members = await _membersCollection.Find(filter).ToListAsync();
                var lastSeenMap = await GetLastSeenBatchAsync(members.Select(m => m.UserEmail));
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
                    LastSeen = lastSeenMap.TryGetValue(m.UserEmail, out var ls) ? ls : null,
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
                    Builders<MongoTeamMember>.Filter.Eq(m => m.IsActive, true),
                    Builders<MongoTeamMember>.Filter.Ne(m => m.UserEmail, ownerEmail)
                );

                var members = await _membersCollection.Find(filter)
                    .SortByDescending(m => m.JoinedAt)
                    .ToListAsync();
                var lastSeenMap = await GetLastSeenBatchAsync(members.Select(m => m.UserEmail));
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
                    LastSeen = lastSeenMap.TryGetValue(m.UserEmail, out var ls) ? ls : null,
                });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "MongoService.GetAllTeamMembersAsync failed for {Email}", ownerEmail);
                return [];
            }
        }

        public async Task<Dictionary<string, DateTime>> GetLastSeenBatchAsync(IEnumerable<string> emails)
        {
            if (_presenceCollection == null) return [];
            var emailList = emails.ToList();
            if (emailList.Count == 0) return [];
            var filter = Builders<UserPresence>.Filter.In(p => p.Email, emailList);
            var presences = await _presenceCollection.Find(filter).ToListAsync();
            return presences.ToDictionary(p => p.Email, p => p.LastSeen, StringComparer.OrdinalIgnoreCase);
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
                .Set(m => m.Role, role)
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
                // Soft delete — consistent with RemoveTeamMemberAsync, RemoveAllMemberRecordsAsync,
                // and LeaveTeamAsync which all set IsActive=false rather than deleting documents (D3 fix).
                await _membersCollection.UpdateManyAsync(filter,
                    Builders<MongoTeamMember>.Update.Set(m => m.IsActive, false));
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
            SenderUsername = i.SenderUsername,
            RecipientEmail = i.RecipientEmail,
            RecipientFullName = i.RecipientFullName,
            RecipientUsername = i.RecipientUsername,
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

        // ── Account lifecycle ─────────────────────────────────────────────────

        /// <summary>
        /// Cleans up all MongoDB data for a deleted user:
        /// removes their presence record, soft-deactivates all team membership
        /// records (as both member and owner), and cancels any pending invitations.
        /// </summary>
        public async Task DeleteUserDataAsync(string userEmail)
        {
            try
            {
                var normalized = userEmail.Trim().ToLowerInvariant();

                if (_presenceCollection != null)
                    await _presenceCollection.DeleteOneAsync(
                        Builders<UserPresence>.Filter.Eq(u => u.Email, normalized));

                if (_membersCollection != null)
                {
                    // Deactivate records where the user is a member of someone else's team
                    await _membersCollection.UpdateManyAsync(
                        Builders<MongoTeamMember>.Filter.Eq(m => m.UserEmail, normalized),
                        Builders<MongoTeamMember>.Update.Set(m => m.IsActive, false));

                    // Deactivate records for teams the user owned
                    await _membersCollection.UpdateManyAsync(
                        Builders<MongoTeamMember>.Filter.Eq(m => m.OwnerEmail, normalized),
                        Builders<MongoTeamMember>.Update.Set(m => m.IsActive, false));
                }

                if (_invitationsCollection != null)
                {
                    await _invitationsCollection.UpdateManyAsync(
                        Builders<TeamInvitation>.Filter.And(
                            Builders<TeamInvitation>.Filter.Eq(i => i.Status, InvitationStatus.Pending),
                            Builders<TeamInvitation>.Filter.Or(
                                Builders<TeamInvitation>.Filter.Eq(i => i.SenderEmail, normalized),
                                Builders<TeamInvitation>.Filter.Eq(i => i.RecipientEmail, normalized))),
                        Builders<TeamInvitation>.Update.Set(i => i.Status, InvitationStatus.Cancelled));
                }

                // Remove the credential backup so the account cannot be ghost-restored
                // on another machine after it has been deleted.
                if (_userAccountsCollection != null)
                    await _userAccountsCollection.DeleteOneAsync(
                        Builders<UserAccount>.Filter.Eq(a => a.Email, normalized));
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "MongoService.DeleteUserDataAsync failed for {Email}", userEmail);
            }
        }

        // ── Credential backup / restoration ───────────────────────────────────

        public async Task BackupUserAccountAsync(string email, string passwordHash, int sqliteId)
        {
            // Do NOT catch exceptions here — callers rely on exceptions propagating to determine
            // whether the backup succeeded.  If the write fails, IsBackedUpToMongo must stay false
            // so BulkSyncStartupService.BackupUnbackedUsersAsync can retry on the next startup.
            if (_userAccountsCollection == null)
                throw new InvalidOperationException("MongoDB user_accounts collection is unavailable.");

            var normalized = email.Trim().ToLowerInvariant();
            var filter = Builders<UserAccount>.Filter.Eq(a => a.Email, normalized);
            var update = Builders<UserAccount>.Update
                .Set(a => a.Email, normalized)
                .Set(a => a.PasswordHash, passwordHash)
                .Set(a => a.SqliteId, sqliteId)
                .Set(a => a.UpdatedAt, DateTime.UtcNow)
                // SetOnInsert ensures _id is always a proper ObjectId on first insert,
                // guarding against a null-_id regression if this method is ever refactored.
                .SetOnInsert(a => a.Id, MongoDB.Bson.ObjectId.GenerateNewId().ToString());
            await _userAccountsCollection.UpdateOneAsync(filter, update,
                new UpdateOptions { IsUpsert = true });
        }

        public async Task<UserAccount?> FindAccountForRestorationAsync(string email)
        {
            if (_userAccountsCollection == null) return null;
            try
            {
                // Use a 6-second hard cap so a dead/slow connection doesn't stall the
                // login endpoint for the full driver ServerSelectionTimeout (8 s).
                using var cts = new System.Threading.CancellationTokenSource(
                    TimeSpan.FromSeconds(6));
                var normalized = email.Trim().ToLowerInvariant();
                var filter = Builders<UserAccount>.Filter.Eq(a => a.Email, normalized);
                return await _userAccountsCollection.Find(filter)
                    .FirstOrDefaultAsync(cts.Token);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "MongoService.FindAccountForRestorationAsync failed for {Email}", email);
                return null;
            }
        }

        // ── Cross-machine notification bus ────────────────────────────────────

        /// <summary>
        /// Writes a pending notification for a user on a different machine.
        /// The recipient's <see cref="BackgroundServices.CrossNotificationPollerService"/> will
        /// pick it up within ~15 seconds, deliver it locally, and delete this document.
        /// </summary>
        public async Task WriteCrossNotificationAsync(CrossNotification notification)
        {
            if (_crossNotificationsCollection == null) return;
            try
            {
                await _crossNotificationsCollection.InsertOneAsync(notification);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "WriteCrossNotificationAsync failed for recipient={Email}", notification.RecipientEmail);
            }
        }

        /// <summary>
        /// Returns all pending cross-notifications addressed to <paramref name="recipientEmail"/>
        /// and atomically deletes them so they are delivered exactly once.
        /// </summary>
        public async Task<List<CrossNotification>> PullAndDeleteCrossNotificationsAsync(string recipientEmail)
        {
            if (_crossNotificationsCollection == null) return [];
            try
            {
                var filter = Builders<CrossNotification>.Filter.Eq(n => n.RecipientEmail,
                    recipientEmail.Trim().ToLowerInvariant());
                var docs = await _crossNotificationsCollection.Find(filter).ToListAsync();
                if (docs.Count > 0)
                {
                    // Snapshot IDs before delete to avoid a race condition between Find and DeleteMany.
                    var ids = docs.Select(d => d.Id).ToList();
                    var idFilter = Builders<CrossNotification>.Filter.In(n => n.Id, ids);
                    await _crossNotificationsCollection.DeleteManyAsync(idFilter);
                }
                return docs;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "PullAndDeleteCrossNotificationsAsync failed for {Email}", recipientEmail);
                return [];
            }
        }

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
