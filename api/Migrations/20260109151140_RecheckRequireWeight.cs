using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class RecheckRequireWeight : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "RequireWeight",
                table: "PatientRechecks",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "WeightUnit",
                table: "PatientRechecks",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "WeightValue",
                table: "PatientRechecks",
                type: "numeric",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequireWeight",
                table: "PatientRechecks");

            migrationBuilder.DropColumn(
                name: "WeightUnit",
                table: "PatientRechecks");

            migrationBuilder.DropColumn(
                name: "WeightValue",
                table: "PatientRechecks");
        }
    }
}
