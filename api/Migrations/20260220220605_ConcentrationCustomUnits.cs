using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class ConcentrationCustomUnits : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DoseMlKgRangeStart",
                table: "MedicationConcentrationSpeciesDoses",
                newName: "DefaultDoseRangeStart");

            migrationBuilder.RenameColumn(
                name: "DoseMlKgRangeEnd",
                table: "MedicationConcentrationSpeciesDoses",
                newName: "DefaultDoseRangeEnd");

            migrationBuilder.RenameColumn(
                name: "DoseMgKgRangeStart",
                table: "MedicationConcentrationSpeciesDoses",
                newName: "ConcentrationDoseRangeStart");

            migrationBuilder.RenameColumn(
                name: "DoseMgKgRangeEnd",
                table: "MedicationConcentrationSpeciesDoses",
                newName: "ConcentrationDoseRangeEnd");

            migrationBuilder.RenameColumn(
                name: "ConcentrationMgMl",
                table: "MedicationConcentrations",
                newName: "ConcentrationValue");

            migrationBuilder.AddColumn<string>(
                name: "ConcentrationUnit",
                table: "MedicationConcentrations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DefaultUnit",
                table: "MedicationConcentrations",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConcentrationUnit",
                table: "MedicationConcentrations");

            migrationBuilder.DropColumn(
                name: "DefaultUnit",
                table: "MedicationConcentrations");

            migrationBuilder.RenameColumn(
                name: "DefaultDoseRangeStart",
                table: "MedicationConcentrationSpeciesDoses",
                newName: "DoseMlKgRangeStart");

            migrationBuilder.RenameColumn(
                name: "DefaultDoseRangeEnd",
                table: "MedicationConcentrationSpeciesDoses",
                newName: "DoseMlKgRangeEnd");

            migrationBuilder.RenameColumn(
                name: "ConcentrationDoseRangeStart",
                table: "MedicationConcentrationSpeciesDoses",
                newName: "DoseMgKgRangeStart");

            migrationBuilder.RenameColumn(
                name: "ConcentrationDoseRangeEnd",
                table: "MedicationConcentrationSpeciesDoses",
                newName: "DoseMgKgRangeEnd");

            migrationBuilder.RenameColumn(
                name: "ConcentrationValue",
                table: "MedicationConcentrations",
                newName: "ConcentrationMgMl");
        }
    }
}
