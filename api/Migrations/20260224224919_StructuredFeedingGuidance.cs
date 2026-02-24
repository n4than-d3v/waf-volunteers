using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class StructuredFeedingGuidance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FeedingGuidance",
                table: "SpeciesVariants");

            migrationBuilder.CreateTable(
                name: "Foods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    Substitute = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Foods", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SpeciesVariantFoods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SpeciesVariantId = table.Column<int>(type: "integer", nullable: false),
                    Time = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    QuantityValue = table.Column<decimal>(type: "numeric", nullable: false),
                    QuantityUnit = table.Column<string>(type: "text", nullable: false),
                    FoodId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpeciesVariantFoods", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SpeciesVariantFoods_Foods_FoodId",
                        column: x => x.FoodId,
                        principalTable: "Foods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SpeciesVariantFoods_SpeciesVariants_SpeciesVariantId",
                        column: x => x.SpeciesVariantId,
                        principalTable: "SpeciesVariants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SpeciesVariantFoods_FoodId",
                table: "SpeciesVariantFoods",
                column: "FoodId");

            migrationBuilder.CreateIndex(
                name: "IX_SpeciesVariantFoods_SpeciesVariantId",
                table: "SpeciesVariantFoods",
                column: "SpeciesVariantId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SpeciesVariantFoods");

            migrationBuilder.DropTable(
                name: "Foods");

            migrationBuilder.AddColumn<string>(
                name: "FeedingGuidance",
                table: "SpeciesVariants",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
