using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class MedicationDoseRanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DoseMlKg",
                table: "MedicationConcentrationSpeciesDoses",
                newName: "DoseMlKgRangeStart");

            migrationBuilder.RenameColumn(
                name: "DoseMgKg",
                table: "MedicationConcentrationSpeciesDoses",
                newName: "DoseMlKgRangeEnd");

            migrationBuilder.AddColumn<double>(
                name: "DoseMgKgRangeEnd",
                table: "MedicationConcentrationSpeciesDoses",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "DoseMgKgRangeStart",
                table: "MedicationConcentrationSpeciesDoses",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DoseMgKgRangeEnd",
                table: "MedicationConcentrationSpeciesDoses");

            migrationBuilder.DropColumn(
                name: "DoseMgKgRangeStart",
                table: "MedicationConcentrationSpeciesDoses");

            migrationBuilder.RenameColumn(
                name: "DoseMlKgRangeStart",
                table: "MedicationConcentrationSpeciesDoses",
                newName: "DoseMlKg");

            migrationBuilder.RenameColumn(
                name: "DoseMlKgRangeEnd",
                table: "MedicationConcentrationSpeciesDoses",
                newName: "DoseMgKg");
        }
    }
}
