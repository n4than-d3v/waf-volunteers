using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class FeedingNotesTopUp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "SpeciesVariantFeeding",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "TopUp",
                table: "SpeciesVariantFeeding",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "PatientFeedings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "TopUp",
                table: "PatientFeedings",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Notes",
                table: "SpeciesVariantFeeding");

            migrationBuilder.DropColumn(
                name: "TopUp",
                table: "SpeciesVariantFeeding");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "PatientFeedings");

            migrationBuilder.DropColumn(
                name: "TopUp",
                table: "PatientFeedings");
        }
    }
}
