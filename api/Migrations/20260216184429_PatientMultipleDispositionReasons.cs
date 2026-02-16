using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class PatientMultipleDispositionReasons : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DispositionReasonPatient",
                columns: table => new
                {
                    DispositionReasonsId = table.Column<int>(type: "integer", nullable: false),
                    PatientsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DispositionReasonPatient", x => new { x.DispositionReasonsId, x.PatientsId });
                    table.ForeignKey(
                        name: "FK_DispositionReasonPatient_DispositionReasons_DispositionReas~",
                        column: x => x.DispositionReasonsId,
                        principalTable: "DispositionReasons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DispositionReasonPatient_Patients_PatientsId",
                        column: x => x.PatientsId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DispositionReasonPatient_PatientsId",
                table: "DispositionReasonPatient",
                column: "PatientsId");

            migrationBuilder.Sql(@"
                INSERT INTO ""DispositionReasonPatient"" (""PatientsId"", ""DispositionReasonsId"")
                SELECT ""Id"", ""DispositionReasonId""
                FROM ""Patients""
                WHERE ""DispositionReasonId"" IS NOT NULL
            ");

            migrationBuilder.DropForeignKey(
                name: "FK_Patients_DispositionReasons_DispositionReasonId",
                table: "Patients");

            migrationBuilder.DropIndex(
                name: "IX_Patients_DispositionReasonId",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "DispositionReasonId",
                table: "Patients");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DispositionReasonPatient");

            migrationBuilder.AddColumn<int>(
                name: "DispositionReasonId",
                table: "Patients",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Patients_DispositionReasonId",
                table: "Patients",
                column: "DispositionReasonId");

            migrationBuilder.AddForeignKey(
                name: "FK_Patients_DispositionReasons_DispositionReasonId",
                table: "Patients",
                column: "DispositionReasonId",
                principalTable: "DispositionReasons",
                principalColumn: "Id");
        }
    }
}
