using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskFlow.Migrations
{
    /// <inheritdoc />
    public partial class AddOfflineSync : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LocalInvitations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MongoId = table.Column<string>(type: "TEXT", nullable: false),
                    SenderEmail = table.Column<string>(type: "TEXT", nullable: false),
                    SenderFullName = table.Column<string>(type: "TEXT", nullable: false),
                    SenderAvatarUrl = table.Column<string>(type: "TEXT", nullable: false),
                    RecipientEmail = table.Column<string>(type: "TEXT", nullable: false),
                    RecipientFullName = table.Column<string>(type: "TEXT", nullable: false),
                    TeamId = table.Column<string>(type: "TEXT", nullable: true),
                    TeamName = table.Column<string>(type: "TEXT", nullable: true),
                    Role = table.Column<string>(type: "TEXT", nullable: false),
                    Message = table.Column<string>(type: "TEXT", nullable: true),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    SentAt = table.Column<string>(type: "TEXT", nullable: false),
                    RespondedAt = table.Column<string>(type: "TEXT", nullable: true),
                    ExpiresAt = table.Column<string>(type: "TEXT", nullable: true),
                    DeclineReason = table.Column<string>(type: "TEXT", nullable: true),
                    CachedAt = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocalInvitations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LocalTeamMembers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MongoId = table.Column<string>(type: "TEXT", nullable: false),
                    TeamId = table.Column<string>(type: "TEXT", nullable: false),
                    TeamName = table.Column<string>(type: "TEXT", nullable: false),
                    OwnerEmail = table.Column<string>(type: "TEXT", nullable: false),
                    UserEmail = table.Column<string>(type: "TEXT", nullable: false),
                    UserFullName = table.Column<string>(type: "TEXT", nullable: false),
                    AvatarUrl = table.Column<string>(type: "TEXT", nullable: true),
                    Role = table.Column<string>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    JoinedAt = table.Column<string>(type: "TEXT", nullable: false),
                    CachedAt = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocalTeamMembers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SyncOutboxEntries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    OperationId = table.Column<string>(type: "TEXT", nullable: false),
                    OperationName = table.Column<string>(type: "TEXT", nullable: false),
                    PayloadJson = table.Column<string>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    Attempts = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<string>(type: "TEXT", nullable: false),
                    LastAttemptAt = table.Column<string>(type: "TEXT", nullable: true),
                    ErrorMessage = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SyncOutboxEntries", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LocalInvitations_MongoId",
                table: "LocalInvitations",
                column: "MongoId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LocalInvitations_RecipientEmail",
                table: "LocalInvitations",
                column: "RecipientEmail");

            migrationBuilder.CreateIndex(
                name: "IX_LocalInvitations_SenderEmail",
                table: "LocalInvitations",
                column: "SenderEmail");

            migrationBuilder.CreateIndex(
                name: "IX_LocalTeamMembers_OwnerEmail",
                table: "LocalTeamMembers",
                column: "OwnerEmail");

            migrationBuilder.CreateIndex(
                name: "IX_LocalTeamMembers_TeamId_OwnerEmail_UserEmail",
                table: "LocalTeamMembers",
                columns: new[] { "TeamId", "OwnerEmail", "UserEmail" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SyncOutboxEntries_CreatedAt",
                table: "SyncOutboxEntries",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_SyncOutboxEntries_OperationId",
                table: "SyncOutboxEntries",
                column: "OperationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SyncOutboxEntries_Status",
                table: "SyncOutboxEntries",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LocalInvitations");

            migrationBuilder.DropTable(
                name: "LocalTeamMembers");

            migrationBuilder.DropTable(
                name: "SyncOutboxEntries");
        }
    }
}
