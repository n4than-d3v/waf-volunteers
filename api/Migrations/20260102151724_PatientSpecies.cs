using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class PatientSpecies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SpeciesId",
                table: "Patients",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SpeciesVariantId",
                table: "Patients",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Patients_SpeciesId",
                table: "Patients",
                column: "SpeciesId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_SpeciesVariantId",
                table: "Patients",
                column: "SpeciesVariantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Patients_SpeciesVariants_SpeciesVariantId",
                table: "Patients",
                column: "SpeciesVariantId",
                principalTable: "SpeciesVariants",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Patients_Species_SpeciesId",
                table: "Patients",
                column: "SpeciesId",
                principalTable: "Species",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Patients_SpeciesVariants_SpeciesVariantId",
                table: "Patients");

            migrationBuilder.DropForeignKey(
                name: "FK_Patients_Species_SpeciesId",
                table: "Patients");

            migrationBuilder.DropIndex(
                name: "IX_Patients_SpeciesId",
                table: "Patients");

            migrationBuilder.DropIndex(
                name: "IX_Patients_SpeciesVariantId",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "SpeciesId",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "SpeciesVariantId",
                table: "Patients");
        }
    }
}
