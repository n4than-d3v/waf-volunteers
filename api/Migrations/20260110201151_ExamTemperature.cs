using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class ExamTemperature : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TemperatureUnit",
                table: "Exams");

            migrationBuilder.RenameColumn(
                name: "TemperatureValue",
                table: "Exams",
                newName: "Temperature");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Temperature",
                table: "Exams",
                newName: "TemperatureValue");

            migrationBuilder.AddColumn<int>(
                name: "TemperatureUnit",
                table: "Exams",
                type: "integer",
                nullable: true);
        }
    }
}
