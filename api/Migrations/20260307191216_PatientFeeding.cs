using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class PatientFeeding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DietPatient");

            migrationBuilder.DropTable(
                name: "SpeciesVariantFoods");

            migrationBuilder.DropTable(
                name: "Diets");

            migrationBuilder.CreateTable(
                name: "PatientFeedings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    Time = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    QuantityValue = table.Column<decimal>(type: "numeric", nullable: false),
                    QuantityUnit = table.Column<string>(type: "text", nullable: false),
                    FoodId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientFeedings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientFeedings_Foods_FoodId",
                        column: x => x.FoodId,
                        principalTable: "Foods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientFeedings_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpeciesVariantFeeding",
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
                    table.PrimaryKey("PK_SpeciesVariantFeeding", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SpeciesVariantFeeding_Foods_FoodId",
                        column: x => x.FoodId,
                        principalTable: "Foods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SpeciesVariantFeeding_SpeciesVariants_SpeciesVariantId",
                        column: x => x.SpeciesVariantId,
                        principalTable: "SpeciesVariants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PatientFeedings_FoodId",
                table: "PatientFeedings",
                column: "FoodId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientFeedings_PatientId",
                table: "PatientFeedings",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_SpeciesVariantFeeding_FoodId",
                table: "SpeciesVariantFeeding",
                column: "FoodId");

            migrationBuilder.CreateIndex(
                name: "IX_SpeciesVariantFeeding_SpeciesVariantId",
                table: "SpeciesVariantFeeding",
                column: "SpeciesVariantId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PatientFeedings");

            migrationBuilder.DropTable(
                name: "SpeciesVariantFeeding");

            migrationBuilder.CreateTable(
                name: "Diets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Diets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SpeciesVariantFoods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FoodId = table.Column<int>(type: "integer", nullable: false),
                    SpeciesVariantId = table.Column<int>(type: "integer", nullable: false),
                    QuantityUnit = table.Column<string>(type: "text", nullable: false),
                    QuantityValue = table.Column<decimal>(type: "numeric", nullable: false),
                    Time = table.Column<TimeOnly>(type: "time without time zone", nullable: false)
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

            migrationBuilder.CreateTable(
                name: "DietPatient",
                columns: table => new
                {
                    DietsId = table.Column<int>(type: "integer", nullable: false),
                    PatientsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DietPatient", x => new { x.DietsId, x.PatientsId });
                    table.ForeignKey(
                        name: "FK_DietPatient_Diets_DietsId",
                        column: x => x.DietsId,
                        principalTable: "Diets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DietPatient_Patients_PatientsId",
                        column: x => x.PatientsId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DietPatient_PatientsId",
                table: "DietPatient",
                column: "PatientsId");

            migrationBuilder.CreateIndex(
                name: "IX_SpeciesVariantFoods_FoodId",
                table: "SpeciesVariantFoods",
                column: "FoodId");

            migrationBuilder.CreateIndex(
                name: "IX_SpeciesVariantFoods_SpeciesVariantId",
                table: "SpeciesVariantFoods",
                column: "SpeciesVariantId");
        }
    }
}
