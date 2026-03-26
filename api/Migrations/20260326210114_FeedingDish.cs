using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class FeedingDish : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Dish",
                table: "SpeciesVariantFeeding",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Dish",
                table: "PatientFeedings",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Dish",
                table: "SpeciesVariantFeeding");

            migrationBuilder.DropColumn(
                name: "Dish",
                table: "PatientFeedings");
        }
    }
}
