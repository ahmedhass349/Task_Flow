/*
  FILE: Migrations/20260526120000_Phase2_CrossMachineConsistency.cs
  PHASE: 2
  MISSION: 1-CrossMachine
  CHANGES:
    - TaskItems.AssigneeEmail (string?, maxLength 320) — stable cross-device key for MongoDB queries.
    - Projects.OwnerEmail (string?, maxLength 320) — stable cross-device key for MongoDB queries.
    - Notifications.UserEmail (string?, maxLength 320) — stable cross-device key for MongoDB queries.
    - CalendarEvents.OwnerEmail (string?, maxLength 320) — stable cross-device key for MongoDB queries.
    - CalendarEvents.SyncId (TEXT not null, UUIDv4 default) — MongoDB _id for ISyncableEntity.
    - CalendarEvents.UpdatedAt (TEXT not null, datetime('now') default) — sync timestamp.
    - CalendarEvents.IsSynced (INTEGER not null, default false) — outbox tracking flag.
    - IX_CalendarEvents_SyncId unique index — cross-device deduplication.
*/
using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace taskflow.Migrations
{
    /// <inheritdoc />
    public partial class Phase2_CrossMachineConsistency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ── TaskItems.AssigneeEmail ───────────────────────────────────────
            migrationBuilder.AddColumn<string>(
                name: "AssigneeEmail",
                table: "TaskItems",
                type: "TEXT",
                maxLength: 320,
                nullable: true);

            // ── Projects.OwnerEmail ───────────────────────────────────────────
            migrationBuilder.AddColumn<string>(
                name: "OwnerEmail",
                table: "Projects",
                type: "TEXT",
                maxLength: 320,
                nullable: true);

            // ── Notifications.UserEmail ───────────────────────────────────────
            migrationBuilder.AddColumn<string>(
                name: "UserEmail",
                table: "Notifications",
                type: "TEXT",
                maxLength: 320,
                nullable: true);

            // ── CalendarEvents — new ISyncableEntity columns ──────────────────
            migrationBuilder.AddColumn<string>(
                name: "OwnerEmail",
                table: "CalendarEvents",
                type: "TEXT",
                maxLength: 320,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SyncId",
                table: "CalendarEvents",
                type: "TEXT",
                nullable: false,
                // Generate a UUIDv4-like value for existing rows
                defaultValueSql: "lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1,1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))");

            migrationBuilder.AddColumn<string>(
                name: "UpdatedAt",
                table: "CalendarEvents",
                type: "TEXT",
                nullable: false,
                defaultValueSql: "datetime('now')");

            migrationBuilder.AddColumn<bool>(
                name: "IsSynced",
                table: "CalendarEvents",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            // ── IX_CalendarEvents_SyncId (unique) ─────────────────────────────
            migrationBuilder.CreateIndex(
                name: "IX_CalendarEvents_SyncId",
                table: "CalendarEvents",
                column: "SyncId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CalendarEvents_SyncId",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "IsSynced",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "SyncId",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "OwnerEmail",
                table: "CalendarEvents");

            migrationBuilder.DropColumn(
                name: "UserEmail",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "OwnerEmail",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "AssigneeEmail",
                table: "TaskItems");
        }
    }
}
