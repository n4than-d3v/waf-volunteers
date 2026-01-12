using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class PrescriptionMedicationConcentration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MedicationConcentrationId",
                table: "PatientPrescriptionMedications",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MedicationConcentrationId",
                table: "ExamTreatmentMedications",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_PatientPrescriptionMedications_MedicationConcentrationId",
                table: "PatientPrescriptionMedications",
                column: "MedicationConcentrationId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamTreatmentMedications_MedicationConcentrationId",
                table: "ExamTreatmentMedications",
                column: "MedicationConcentrationId");

            migrationBuilder.AddForeignKey(
                name: "FK_ExamTreatmentMedications_MedicationConcentrations_Medicatio~",
                table: "ExamTreatmentMedications",
                column: "MedicationConcentrationId",
                principalTable: "MedicationConcentrations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PatientPrescriptionMedications_MedicationConcentrations_Med~",
                table: "PatientPrescriptionMedications",
                column: "MedicationConcentrationId",
                principalTable: "MedicationConcentrations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExamTreatmentMedications_MedicationConcentrations_Medicatio~",
                table: "ExamTreatmentMedications");

            migrationBuilder.DropForeignKey(
                name: "FK_PatientPrescriptionMedications_MedicationConcentrations_Med~",
                table: "PatientPrescriptionMedications");

            migrationBuilder.DropIndex(
                name: "IX_PatientPrescriptionMedications_MedicationConcentrationId",
                table: "PatientPrescriptionMedications");

            migrationBuilder.DropIndex(
                name: "IX_ExamTreatmentMedications_MedicationConcentrationId",
                table: "ExamTreatmentMedications");

            migrationBuilder.DropColumn(
                name: "MedicationConcentrationId",
                table: "PatientPrescriptionMedications");

            migrationBuilder.DropColumn(
                name: "MedicationConcentrationId",
                table: "ExamTreatmentMedications");
        }
    }
}
