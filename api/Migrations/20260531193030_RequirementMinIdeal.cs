using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class RequirementMinIdeal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Minimum",
                table: "Requirements",
                newName: "Ideal");

            migrationBuilder.AddColumn<int>(
                name: "BareMinimum",
                table: "Requirements",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BareMinimum",
                table: "Requirements");

            migrationBuilder.RenameColumn(
                name: "Ideal",
                table: "Requirements",
                newName: "Minimum");
        }
    }
}
