using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class MedicationDefaults : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AdministrationMethodId",
                table: "MedicationConcentrationSpeciesDoses",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Frequency",
                table: "MedicationConcentrationSpeciesDoses",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MedicationConcentrationSpeciesDoses_AdministrationMethodId",
                table: "MedicationConcentrationSpeciesDoses",
                column: "AdministrationMethodId");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicationConcentrationSpeciesDoses_AdministrationMethods_A~",
                table: "MedicationConcentrationSpeciesDoses",
                column: "AdministrationMethodId",
                principalTable: "AdministrationMethods",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicationConcentrationSpeciesDoses_AdministrationMethods_A~",
                table: "MedicationConcentrationSpeciesDoses");

            migrationBuilder.DropIndex(
                name: "IX_MedicationConcentrationSpeciesDoses_AdministrationMethodId",
                table: "MedicationConcentrationSpeciesDoses");

            migrationBuilder.DropColumn(
                name: "AdministrationMethodId",
                table: "MedicationConcentrationSpeciesDoses");

            migrationBuilder.DropColumn(
                name: "Frequency",
                table: "MedicationConcentrationSpeciesDoses");
        }
    }
}
