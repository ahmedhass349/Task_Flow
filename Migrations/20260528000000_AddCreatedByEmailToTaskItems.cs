/*
  FILE: Migrations/20260528000000_AddCreatedByEmailToTaskItems.cs
  PHASE: 2
  DEFECT: 3-Persistence
  CHANGES:
    - TaskItems.CreatedByEmail (string?, maxLength 320) — stable cross-device email of the task
      creator. Used by UserDataSyncService's OR filter to pull tasks that this user created but
      did not assign to themselves (e.g. tasks assigned to a team member). Without this field
      those tasks are invisible to the creator on Machine B after they are created on Machine A.
*/
using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace taskflow.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatedByEmailToTaskItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedByEmail",
                table: "TaskItems",
                type: "TEXT",
                maxLength: 320,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByEmail",
                table: "TaskItems");
        }
    }
}
