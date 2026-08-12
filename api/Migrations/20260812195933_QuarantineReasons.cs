using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class QuarantineReasons : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "QuarantineReasonId",
                table: "Patients",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsQuarantine",
                table: "Areas",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "QuarantineReason",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuarantineReason", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Patients_QuarantineReasonId",
                table: "Patients",
                column: "QuarantineReasonId");

            migrationBuilder.AddForeignKey(
                name: "FK_Patients_QuarantineReason_QuarantineReasonId",
                table: "Patients",
                column: "QuarantineReasonId",
                principalTable: "QuarantineReason",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Patients_QuarantineReason_QuarantineReasonId",
                table: "Patients");

            migrationBuilder.DropTable(
                name: "QuarantineReason");

            migrationBuilder.DropIndex(
                name: "IX_Patients_QuarantineReasonId",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "QuarantineReasonId",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "IsQuarantine",
                table: "Areas");
        }
    }
}
