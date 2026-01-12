using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveSpeciesAge : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exams_SpeciesAges_SpeciesAgeId",
                table: "Exams");

            migrationBuilder.DropTable(
                name: "SpeciesAges");

            migrationBuilder.RenameColumn(
                name: "SpeciesAgeId",
                table: "Exams",
                newName: "SpeciesVariantId");

            migrationBuilder.RenameIndex(
                name: "IX_Exams_SpeciesAgeId",
                table: "Exams",
                newName: "IX_Exams_SpeciesVariantId");

            migrationBuilder.AddColumn<string>(
                name: "FriendlyName",
                table: "SpeciesVariants",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_SpeciesVariants_SpeciesVariantId",
                table: "Exams",
                column: "SpeciesVariantId",
                principalTable: "SpeciesVariants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exams_SpeciesVariants_SpeciesVariantId",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "FriendlyName",
                table: "SpeciesVariants");

            migrationBuilder.RenameColumn(
                name: "SpeciesVariantId",
                table: "Exams",
                newName: "SpeciesAgeId");

            migrationBuilder.RenameIndex(
                name: "IX_Exams_SpeciesVariantId",
                table: "Exams",
                newName: "IX_Exams_SpeciesAgeId");

            migrationBuilder.CreateTable(
                name: "SpeciesAges",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AssociatedVariantId = table.Column<int>(type: "integer", nullable: false),
                    SpeciesId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpeciesAges", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SpeciesAges_SpeciesVariants_AssociatedVariantId",
                        column: x => x.AssociatedVariantId,
                        principalTable: "SpeciesVariants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SpeciesAges_Species_SpeciesId",
                        column: x => x.SpeciesId,
                        principalTable: "Species",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SpeciesAges_AssociatedVariantId",
                table: "SpeciesAges",
                column: "AssociatedVariantId");

            migrationBuilder.CreateIndex(
                name: "IX_SpeciesAges_SpeciesId",
                table: "SpeciesAges",
                column: "SpeciesId");

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_SpeciesAges_SpeciesAgeId",
                table: "Exams",
                column: "SpeciesAgeId",
                principalTable: "SpeciesAges",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
