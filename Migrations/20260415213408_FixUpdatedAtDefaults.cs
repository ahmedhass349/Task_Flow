using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskFlow.Migrations
{
    /// <inheritdoc />
    public partial class FixUpdatedAtDefaults : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // The previous migration (AddSyncFields) added UpdatedAt with DEFAULT ''
            // (empty string). EF Core SQLite cannot parse '' as DateTime, causing a
            // FormatException on every SELECT from those tables. Fix all existing rows
            // by setting UpdatedAt to the current UTC time where it was left empty.
            const string fix = "UPDATE \"{0}\" SET \"UpdatedAt\" = strftime('%Y-%m-%dT%H:%M:%S', 'now') WHERE \"UpdatedAt\" = '';";
            migrationBuilder.Sql(string.Format(fix, "TaskItems"));
            migrationBuilder.Sql(string.Format(fix, "Reminders"));
            migrationBuilder.Sql(string.Format(fix, "Projects"));
            migrationBuilder.Sql(string.Format(fix, "Notifications"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Not reversible — we cannot restore the original empty-string values
        }
    }
}
