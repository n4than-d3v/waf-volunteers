using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class ReferenceDataDeletions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BoardCustomPens_Boards_BoardId",
                table: "BoardCustomPens");

            migrationBuilder.DropIndex(
                name: "IX_BoardCustomPens_BoardId",
                table: "BoardCustomPens");

            migrationBuilder.DropColumn(
                name: "BoardId",
                table: "BoardCustomPens");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "TransferLocations",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "Tags",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "ReleaseTypes",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "QuarantineReason",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "Medications",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "MedicationConcentrationSpeciesDoses",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "MedicationConcentrations",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "HusbandryConcernReasons",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "HusbandryConcernCategories",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "Foods",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "DispositionReasons",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "CustomDailyTasks",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "BoardBoardCustomPen",
                columns: table => new
                {
                    BoardsId = table.Column<int>(type: "integer", nullable: false),
                    CustomPensId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BoardBoardCustomPen", x => new { x.BoardsId, x.CustomPensId });
                    table.ForeignKey(
                        name: "FK_BoardBoardCustomPen_BoardCustomPens_CustomPensId",
                        column: x => x.CustomPensId,
                        principalTable: "BoardCustomPens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BoardBoardCustomPen_Boards_BoardsId",
                        column: x => x.BoardsId,
                        principalTable: "Boards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BoardBoardCustomPen_CustomPensId",
                table: "BoardBoardCustomPen",
                column: "CustomPensId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BoardBoardCustomPen");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "TransferLocations");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "Tags");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "ReleaseTypes");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "QuarantineReason");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "Medications");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "MedicationConcentrationSpeciesDoses");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "MedicationConcentrations");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "HusbandryConcernReasons");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "HusbandryConcernCategories");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "Foods");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "DispositionReasons");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "CustomDailyTasks");

            migrationBuilder.AddColumn<int>(
                name: "BoardId",
                table: "BoardCustomPens",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_BoardCustomPens_BoardId",
                table: "BoardCustomPens",
                column: "BoardId");

            migrationBuilder.AddForeignKey(
                name: "FK_BoardCustomPens_Boards_BoardId",
                table: "BoardCustomPens",
                column: "BoardId",
                principalTable: "Boards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
