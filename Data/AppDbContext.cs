/*
      FILE: Data/AppDbContext.cs
      PHASE: Phase 2
      PURPOSE: Defines EF Core model and applies SQLite-safe enum and DateTime conversions.
      CHANGED FROM: Phase 1 version — added SaveChangesAsync override to auto-stamp ISyncableEntity.UpdatedAt / SyncId;
                    added unique SyncId indexes on TaskItem, Project, Notification, Reminder.
*/

using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using taskflow.Data.Entities;

namespace taskflow.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // ── Phase 2: auto-stamp ISyncableEntity on every save ──────────────────────
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<ISyncableEntity>())
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    if (entry.Entity.SyncId == Guid.Empty)
                        entry.Entity.SyncId = Guid.NewGuid();
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    entry.Entity.IsSynced = false;
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }

        // ── DbSets ────────────────────────────────────────────────────────────
        public DbSet<AppUser> AppUsers => Set<AppUser>();
        public DbSet<Project> Projects => Set<Project>();
        public DbSet<ProjectMember> ProjectMembers => Set<ProjectMember>();
        public DbSet<TaskItem> TaskItems => Set<TaskItem>();
        public DbSet<TaskComment> TaskComments => Set<TaskComment>();
        public DbSet<Team> Teams => Set<Team>();
        public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
        public DbSet<Message> Messages => Set<Message>();
        public DbSet<Notification> Notifications => Set<Notification>();
        public DbSet<Reminder> Reminders => Set<Reminder>();
        public DbSet<CalendarEvent> CalendarEvents => Set<CalendarEvent>();
        public DbSet<ChatbotConversation> ChatbotConversations => Set<ChatbotConversation>();
        public DbSet<ChatbotMessage> ChatbotMessages => Set<ChatbotMessage>();

        // ── Offline sync ──────────────────────────────────────────────────────
        public DbSet<SyncOutboxEntry> SyncOutboxEntries => Set<SyncOutboxEntry>();
        public DbSet<LocalInvitation> LocalInvitations => Set<LocalInvitation>();
        public DbSet<LocalTeamMember> LocalTeamMembers => Set<LocalTeamMember>();

        // ── Group Chats ───────────────────────────────────────────────────────
        public DbSet<GroupChat> GroupChats => Set<GroupChat>();
        public DbSet<GroupChatMember> GroupChatMembers => Set<GroupChatMember>();
        public DbSet<GroupMessage> GroupMessages => Set<GroupMessage>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ── AppUser ───────────────────────────────────────────────────────
            modelBuilder.Entity<AppUser>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.FullName).HasMaxLength(200).IsRequired();
                entity.Property(e => e.FirstName).HasMaxLength(100).IsRequired();
                entity.Property(e => e.LastName).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Email).HasMaxLength(320).IsRequired();
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.Company).HasMaxLength(200);
                entity.Property(e => e.Country).HasMaxLength(100);
                entity.Property(e => e.Phone).HasMaxLength(30);
                entity.Property(e => e.Timezone).HasMaxLength(100);
                entity.Property(e => e.ResetToken).HasMaxLength(500);
            });

            // ── Project ───────────────────────────────────────────────────────
            modelBuilder.Entity<Project>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(200).IsRequired();                entity.HasIndex(e => e.SyncId).IsUnique(); // Phase 2: cross-device dedup                entity.Property(e => e.Color).HasMaxLength(20);

                entity.HasOne(p => p.Owner)
                      .WithMany(u => u.OwnedProjects)
                      .HasForeignKey(p => p.OwnerId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ── ProjectMember (composite PK) ──────────────────────────────────
            modelBuilder.Entity<ProjectMember>(entity =>
            {
                entity.HasKey(pm => new { pm.ProjectId, pm.UserId });

                entity.Property(pm => pm.Role)
                      .HasConversion<string>()
                      .HasMaxLength(50);

                entity.HasOne(pm => pm.Project)
                      .WithMany(p => p.Members)
                      .HasForeignKey(pm => pm.ProjectId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(pm => pm.User)
                      .WithMany(u => u.ProjectMemberships)
                      .HasForeignKey(pm => pm.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ── TaskItem ──────────────────────────────────────────────────────
            modelBuilder.Entity<TaskItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).HasMaxLength(500).IsRequired();                entity.HasIndex(e => e.SyncId).IsUnique(); // Phase 2: cross-device dedup
                entity.Property(e => e.Priority)
                      .HasConversion<string>()
                      .HasMaxLength(50);

                entity.Property(e => e.Status)
                      .HasConversion<string>()
                      .HasMaxLength(50);

                entity.HasOne(t => t.Project)
                      .WithMany(p => p.Tasks)
                      .HasForeignKey(t => t.ProjectId)
                      .IsRequired(false)
                      .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(t => t.Assignee)
                      .WithMany(u => u.AssignedTasks)
                      .HasForeignKey(t => t.AssigneeId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // ── TaskComment ───────────────────────────────────────────────────
            modelBuilder.Entity<TaskComment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Body).IsRequired();

                entity.HasOne(c => c.Task)
                      .WithMany(t => t.Comments)
                      .HasForeignKey(c => c.TaskId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(c => c.Author)
                      .WithMany(u => u.TaskComments)
                      .HasForeignKey(c => c.AuthorId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ── Team ──────────────────────────────────────────────────────────
            modelBuilder.Entity<Team>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(200).IsRequired();

                entity.HasOne(t => t.Owner)
                      .WithMany(u => u.OwnedTeams)
                      .HasForeignKey(t => t.OwnerId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ── TeamMember (composite PK) ─────────────────────────────────────
            modelBuilder.Entity<TeamMember>(entity =>
            {
                entity.HasKey(tm => new { tm.TeamId, tm.UserId });

                entity.Property(tm => tm.Role)
                      .HasConversion<string>()
                      .HasMaxLength(50);

                entity.HasOne(tm => tm.Team)
                      .WithMany(t => t.Members)
                      .HasForeignKey(tm => tm.TeamId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(tm => tm.User)
                      .WithMany(u => u.TeamMemberships)
                      .HasForeignKey(tm => tm.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ── Message ───────────────────────────────────────────────────────
            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Body).IsRequired();

                entity.HasOne(m => m.Sender)
                      .WithMany(u => u.SentMessages)
                      .HasForeignKey(m => m.SenderId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(m => m.Receiver)
                      .WithMany(u => u.ReceivedMessages)
                      .HasForeignKey(m => m.ReceiverId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ── Notification ──────────────────────────────────────────────────
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).HasMaxLength(500).IsRequired();
                entity.Property(e => e.Message).HasMaxLength(1000);
                entity.Property(e => e.ActionUrl).HasMaxLength(500);

                entity.Property(e => e.Type)
                      .HasConversion<string>()
                      .HasMaxLength(50);

                entity.Property(e => e.Priority)
                      .HasConversion<string>()
                      .HasMaxLength(50);

                // Indexes for performance
                entity.HasIndex(e => new { e.UserId, e.IsRead });                entity.HasIndex(e => e.SyncId).IsUnique(); // Phase 2: cross-device dedup                entity.HasIndex(e => new { e.UserId, e.CreatedAt });

                entity.HasOne(n => n.User)
                      .WithMany(u => u.Notifications)
                      .HasForeignKey(n => n.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(n => n.RelatedTask)
                      .WithMany()
                      .HasForeignKey(n => n.RelatedTaskId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // ── Reminder ─────────────────────────────────────────────────────
            modelBuilder.Entity<Reminder>(entity =>
            {
                entity.HasKey(e => e.Id);

                // Indexes for performance
                entity.HasIndex(e => new { e.FireAt, e.HasFired });                entity.HasIndex(e => e.SyncId).IsUnique(); // Phase 2: cross-device dedup                entity.HasIndex(e => e.TaskId);

                entity.HasOne(r => r.Task)
                      .WithMany()
                      .HasForeignKey(r => r.TaskId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(r => r.User)
                      .WithMany()
                      .HasForeignKey(r => r.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ── CalendarEvent ─────────────────────────────────────────────────
            modelBuilder.Entity<CalendarEvent>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).HasMaxLength(500).IsRequired();
                entity.Property(e => e.Color).HasMaxLength(20);
                entity.Property(e => e.MeetingLink).HasMaxLength(2048);

                entity.HasOne(ce => ce.Owner)
                      .WithMany(u => u.CalendarEvents)
                      .HasForeignKey(ce => ce.OwnerId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ── ChatbotConversation ───────────────────────────────────────────
            modelBuilder.Entity<ChatbotConversation>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).HasMaxLength(500).IsRequired();

                entity.HasOne(c => c.User)
                      .WithMany(u => u.ChatbotConversations)
                      .HasForeignKey(c => c.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ── ChatbotMessage ────────────────────────────────────────────────
            modelBuilder.Entity<ChatbotMessage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Role).HasMaxLength(20).IsRequired();
                entity.Property(e => e.Text).IsRequired();

                entity.HasOne(m => m.Conversation)
                      .WithMany(c => c.Messages)
                      .HasForeignKey(m => m.ConversationId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

                  var dateTimeConverter = new ValueConverter<DateTime, string>(
                        v => v.ToString("o"),
                        v => DateTime.Parse(v, null, System.Globalization.DateTimeStyles.RoundtripKind));

                  var nullableDateTimeConverter = new ValueConverter<DateTime?, string?>(
                        v => v.HasValue ? v.Value.ToString("o") : null,
                        v => v != null ? DateTime.Parse(v, null, System.Globalization.DateTimeStyles.RoundtripKind) : null);

                  foreach (var entityType in modelBuilder.Model.GetEntityTypes())
                  {
                        foreach (var property in entityType.GetProperties())
                        {
                              if (property.ClrType == typeof(DateTime))
                              {
                                    property.SetValueConverter(dateTimeConverter);
                              }

                              if (property.ClrType == typeof(DateTime?))
                              {
                                    property.SetValueConverter(nullableDateTimeConverter);
                              }
                        }
                  }

            // ── SyncOutboxEntry ───────────────────────────────────────────────
            modelBuilder.Entity<SyncOutboxEntry>(e =>
            {
                e.HasIndex(x => x.Status);
                e.HasIndex(x => x.CreatedAt);
                e.HasIndex(x => x.OperationId).IsUnique();
            });

            // ── LocalInvitation ───────────────────────────────────────────────
            modelBuilder.Entity<LocalInvitation>(e =>
            {
                e.HasIndex(x => x.MongoId).IsUnique();
                e.HasIndex(x => x.RecipientEmail);
                e.HasIndex(x => x.SenderEmail);
            });

            // ── LocalTeamMember ───────────────────────────────────────────────
            modelBuilder.Entity<LocalTeamMember>(e =>
            {
                e.HasIndex(x => new { x.TeamId, x.OwnerEmail, x.UserEmail }).IsUnique();
                e.HasIndex(x => x.OwnerEmail);
            });

            // ── GroupChat ─────────────────────────────────────────────────────
            modelBuilder.Entity<GroupChat>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(200).IsRequired();

                entity.HasOne(g => g.CreatedBy)
                      .WithMany()
                      .HasForeignKey(g => g.CreatedByUserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ── GroupChatMember (composite PK) ────────────────────────────────
            modelBuilder.Entity<GroupChatMember>(entity =>
            {
                entity.HasKey(m => new { m.GroupChatId, m.UserId });

                entity.HasOne(m => m.GroupChat)
                      .WithMany(g => g.Members)
                      .HasForeignKey(m => m.GroupChatId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(m => m.User)
                      .WithMany()
                      .HasForeignKey(m => m.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ── GroupMessage ──────────────────────────────────────────────────
            modelBuilder.Entity<GroupMessage>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => new { e.GroupChatId, e.SentAt });

                entity.HasOne(m => m.GroupChat)
                      .WithMany(g => g.Messages)
                      .HasForeignKey(m => m.GroupChatId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(m => m.Sender)
                      .WithMany()
                      .HasForeignKey(m => m.SenderId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

        }
    }
}
