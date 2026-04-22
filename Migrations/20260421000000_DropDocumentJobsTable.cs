using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskFlow.Migrations
{
    /// <inheritdoc />
    public partial class DropDocumentJobsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // DocumentJobs was an orphaned table — its migration file was deleted after being applied
            // and the entity was removed from the EF model. Drop it from the physical database.
            migrationBuilder.Sql("DROP TABLE IF EXISTS \"DocumentJobs\";");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Not reversible — the entity model no longer exists
        }
    }
}
