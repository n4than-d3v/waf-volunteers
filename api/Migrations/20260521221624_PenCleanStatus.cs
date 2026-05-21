using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class PenCleanStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NeedsCleaning",
                table: "Pens");

            migrationBuilder.AddColumn<int>(
                name: "CleanStatus",
                table: "Pens",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CustomBoardMessage",
                table: "Pens",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CleanStatus",
                table: "Pens");

            migrationBuilder.DropColumn(
                name: "CustomBoardMessage",
                table: "Pens");

            migrationBuilder.AddColumn<bool>(
                name: "NeedsCleaning",
                table: "Pens",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
