using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskFlow.Migrations
{
    /// <inheritdoc />
    public partial class AddSyncFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Notifications_UserId_CreatedAt",
                table: "Notifications");

            migrationBuilder.AddColumn<bool>(
                name: "IsSynced",
                table: "TaskItems",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "LastModifiedBy",
                table: "TaskItems",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SyncId",
                table: "TaskItems",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "UpdatedAt",
                table: "TaskItems",
                type: "TEXT",
                nullable: false,
                defaultValueSql: "strftime('%Y-%m-%dT%H:%M:%S', 'now')");

            migrationBuilder.AddColumn<bool>(
                name: "IsSynced",
                table: "Reminders",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "SyncId",
                table: "Reminders",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "UpdatedAt",
                table: "Reminders",
                type: "TEXT",
                nullable: false,
                defaultValueSql: "strftime('%Y-%m-%dT%H:%M:%S', 'now')");

            migrationBuilder.AddColumn<bool>(
                name: "IsSynced",
                table: "Projects",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "SyncId",
                table: "Projects",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "UpdatedAt",
                table: "Projects",
                type: "TEXT",
                nullable: false,
                defaultValueSql: "strftime('%Y-%m-%dT%H:%M:%S', 'now')");

            migrationBuilder.AddColumn<bool>(
                name: "IsSynced",
                table: "Notifications",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "SyncId",
                table: "Notifications",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "UpdatedAt",
                table: "Notifications",
                type: "TEXT",
                nullable: false,
                defaultValueSql: "strftime('%Y-%m-%dT%H:%M:%S', 'now')");

            // Assign unique GUIDs to any existing rows before creating unique indexes.
            // SQLite's randomblob() is evaluated per-row inside UPDATE, so each row
            // receives a distinct value. Without this, multiple rows with the default
            // 00000000-... value would violate the UNIQUE constraint on index creation.
            const string uuidExpr =
                "lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || " +
                "substr(lower(hex(randomblob(2))),2) || '-' || " +
                "substr('89ab', abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || " +
                "lower(hex(randomblob(6)))";

            migrationBuilder.Sql($"UPDATE \"TaskItems\" SET \"SyncId\" = {uuidExpr} WHERE \"SyncId\" = '00000000-0000-0000-0000-000000000000';");
            migrationBuilder.Sql($"UPDATE \"Reminders\" SET \"SyncId\" = {uuidExpr} WHERE \"SyncId\" = '00000000-0000-0000-0000-000000000000';");
            migrationBuilder.Sql($"UPDATE \"Projects\" SET \"SyncId\" = {uuidExpr} WHERE \"SyncId\" = '00000000-0000-0000-0000-000000000000';");
            migrationBuilder.Sql($"UPDATE \"Notifications\" SET \"SyncId\" = {uuidExpr} WHERE \"SyncId\" = '00000000-0000-0000-0000-000000000000';");

            migrationBuilder.CreateIndex(
                name: "IX_TaskItems_SyncId",
                table: "TaskItems",
                column: "SyncId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reminders_SyncId",
                table: "Reminders",
                column: "SyncId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_SyncId",
                table: "Projects",
                column: "SyncId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_SyncId",
                table: "Notifications",
                column: "SyncId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TaskItems_SyncId",
                table: "TaskItems");

            migrationBuilder.DropIndex(
                name: "IX_Reminders_SyncId",
                table: "Reminders");

            migrationBuilder.DropIndex(
                name: "IX_Projects_SyncId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_SyncId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "IsSynced",
                table: "TaskItems");

            migrationBuilder.DropColumn(
                name: "LastModifiedBy",
                table: "TaskItems");

            migrationBuilder.DropColumn(
                name: "SyncId",
                table: "TaskItems");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "TaskItems");

            migrationBuilder.DropColumn(
                name: "IsSynced",
                table: "Reminders");

            migrationBuilder.DropColumn(
                name: "SyncId",
                table: "Reminders");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Reminders");

            migrationBuilder.DropColumn(
                name: "IsSynced",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "SyncId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "IsSynced",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "SyncId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Notifications");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId_CreatedAt",
                table: "Notifications",
                columns: new[] { "UserId", "CreatedAt" });
        }
    }
}
