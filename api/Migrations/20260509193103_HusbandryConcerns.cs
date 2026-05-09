using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class HusbandryConcerns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CustomDailyTasks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Location = table.Column<string>(type: "text", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false),
                    LastDone = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomDailyTasks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HusbandryConcernCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HusbandryConcernCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HusbandryConcernReasons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CategoryId = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HusbandryConcernReasons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HusbandryConcernReasons_HusbandryConcernCategories_Category~",
                        column: x => x.CategoryId,
                        principalTable: "HusbandryConcernCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HusbandryConcerns",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PenId = table.Column<int>(type: "integer", nullable: false),
                    ReasonId = table.Column<int>(type: "integer", nullable: false),
                    Raised = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Checked = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HusbandryConcerns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HusbandryConcerns_HusbandryConcernReasons_ReasonId",
                        column: x => x.ReasonId,
                        principalTable: "HusbandryConcernReasons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HusbandryConcerns_Pens_PenId",
                        column: x => x.PenId,
                        principalTable: "Pens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HusbandryConcernReasons_CategoryId",
                table: "HusbandryConcernReasons",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_HusbandryConcerns_PenId",
                table: "HusbandryConcerns",
                column: "PenId");

            migrationBuilder.CreateIndex(
                name: "IX_HusbandryConcerns_ReasonId",
                table: "HusbandryConcerns",
                column: "ReasonId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CustomDailyTasks");

            migrationBuilder.DropTable(
                name: "HusbandryConcerns");

            migrationBuilder.DropTable(
                name: "HusbandryConcernReasons");

            migrationBuilder.DropTable(
                name: "HusbandryConcernCategories");
        }
    }
}
