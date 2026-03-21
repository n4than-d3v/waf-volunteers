using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class HomeCarerPermissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HomeCarerPermissions",
                table: "Species",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HomeCarerPermissions",
                table: "Accounts",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HomeCarerPermissions",
                table: "Species");

            migrationBuilder.DropColumn(
                name: "HomeCarerPermissions",
                table: "Accounts");
        }
    }
}
