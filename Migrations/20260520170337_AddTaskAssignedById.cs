using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskFlow.Migrations
{
    /// <inheritdoc />
    public partial class AddTaskAssignedById : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AssignedById",
                table: "TaskItems",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TaskItems_AssignedById",
                table: "TaskItems",
                column: "AssignedById");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskItems_AppUsers_AssignedById",
                table: "TaskItems",
                column: "AssignedById",
                principalTable: "AppUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskItems_AppUsers_AssignedById",
                table: "TaskItems");

            migrationBuilder.DropIndex(
                name: "IX_TaskItems_AssignedById",
                table: "TaskItems");

            migrationBuilder.DropColumn(
                name: "AssignedById",
                table: "TaskItems");
        }
    }
}
