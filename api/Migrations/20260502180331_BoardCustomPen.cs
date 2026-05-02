using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class BoardCustomPen : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BoardCustomPens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BoardId = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Body = table.Column<string[]>(type: "text[]", nullable: false),
                    Tags = table.Column<string[]>(type: "text[]", nullable: false),
                    ExpiresOn = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BoardCustomPens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BoardCustomPens_Boards_BoardId",
                        column: x => x.BoardId,
                        principalTable: "Boards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BoardCustomPenTasks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BoardCustomPenId = table.Column<int>(type: "integer", nullable: false),
                    Time = table.Column<string>(type: "text", nullable: false),
                    QuantityValue = table.Column<decimal>(type: "numeric", nullable: false),
                    QuantityUnit = table.Column<string>(type: "text", nullable: false),
                    FoodOrTask = table.Column<string>(type: "text", nullable: false),
                    TopUp = table.Column<bool>(type: "boolean", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    Dish = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BoardCustomPenTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BoardCustomPenTasks_BoardCustomPens_BoardCustomPenId",
                        column: x => x.BoardCustomPenId,
                        principalTable: "BoardCustomPens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BoardCustomPens_BoardId",
                table: "BoardCustomPens",
                column: "BoardId");

            migrationBuilder.CreateIndex(
                name: "IX_BoardCustomPenTasks_BoardCustomPenId",
                table: "BoardCustomPenTasks",
                column: "BoardCustomPenId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BoardCustomPenTasks");

            migrationBuilder.DropTable(
                name: "BoardCustomPens");
        }
    }
}
