// FILE: Migrations/20260522145109_Phase1_RenameAdminToLeader.cs  PHASE: 1  CHANGES: Rename stored "Admin" → "Leader" in TeamMembers.Role
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskFlow.Migrations
{
    /// <inheritdoc />
    public partial class Phase1_RenameAdminToLeader : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // PHASE 1: rename existing "Admin" role string values to "Leader"
            migrationBuilder.Sql("UPDATE TeamMembers SET Role = 'Leader' WHERE Role = 'Admin'");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE TeamMembers SET Role = 'Admin' WHERE Role = 'Leader'");
        }
    }
}
