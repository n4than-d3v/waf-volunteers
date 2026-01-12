using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class MedicationRestructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Medications_PharmaceuticalForms_PharmaceuticalFormId",
                table: "Medications");

            migrationBuilder.DropForeignKey(
                name: "FK_Medications_TherapeuticGroups_TherapeuticGroupId",
                table: "Medications");

            migrationBuilder.DropTable(
                name: "ActiveSubstanceMedication");

            migrationBuilder.DropTable(
                name: "MedicationTargetSpecies");

            migrationBuilder.DropTable(
                name: "PharmaceuticalForms");

            migrationBuilder.DropTable(
                name: "TherapeuticGroups");

            migrationBuilder.DropTable(
                name: "ActiveSubstances");

            migrationBuilder.DropTable(
                name: "TargetSpecies");

            migrationBuilder.DropIndex(
                name: "IX_Medications_PharmaceuticalFormId",
                table: "Medications");

            migrationBuilder.DropIndex(
                name: "IX_Medications_TherapeuticGroupId",
                table: "Medications");

            migrationBuilder.DropColumn(
                name: "ControlledDrug",
                table: "Medications");

            migrationBuilder.DropColumn(
                name: "Distributors",
                table: "Medications");

            migrationBuilder.DropColumn(
                name: "MAHolder",
                table: "Medications");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Medications");

            migrationBuilder.DropColumn(
                name: "PAARLink",
                table: "Medications");

            migrationBuilder.DropColumn(
                name: "PharmaceuticalFormId",
                table: "Medications");

            migrationBuilder.DropColumn(
                name: "SPCLink",
                table: "Medications");

            migrationBuilder.DropColumn(
                name: "TherapeuticGroupId",
                table: "Medications");

            migrationBuilder.DropColumn(
                name: "UKPARLink",
                table: "Medications");

            migrationBuilder.DropColumn(
                name: "Used",
                table: "Medications");

            migrationBuilder.RenameColumn(
                name: "VMNo",
                table: "Medications",
                newName: "Notes");

            migrationBuilder.RenameColumn(
                name: "VMDProductNo",
                table: "Medications",
                newName: "ActiveSubstance");

            migrationBuilder.AddColumn<int>(
                name: "SpeciesType",
                table: "Species",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string[]>(
                name: "Brands",
                table: "Medications",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "AdministrationMethods",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "MedicationConcentrations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MedicationId = table.Column<int>(type: "integer", nullable: false),
                    Form = table.Column<string>(type: "text", nullable: false),
                    ConcentrationMgMl = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationConcentrations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicationConcentrations_Medications_MedicationId",
                        column: x => x.MedicationId,
                        principalTable: "Medications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MedicationConcentrationSpeciesDoses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MedicationConcentrationId = table.Column<int>(type: "integer", nullable: false),
                    SpeciesId = table.Column<int>(type: "integer", nullable: true),
                    SpeciesType = table.Column<int>(type: "integer", nullable: true),
                    DoseMgKg = table.Column<double>(type: "double precision", nullable: false),
                    DoseMlKg = table.Column<double>(type: "double precision", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationConcentrationSpeciesDoses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicationConcentrationSpeciesDoses_MedicationConcentration~",
                        column: x => x.MedicationConcentrationId,
                        principalTable: "MedicationConcentrations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicationConcentrationSpeciesDoses_Species_SpeciesId",
                        column: x => x.SpeciesId,
                        principalTable: "Species",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_MedicationConcentrations_MedicationId",
                table: "MedicationConcentrations",
                column: "MedicationId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationConcentrationSpeciesDoses_MedicationConcentration~",
                table: "MedicationConcentrationSpeciesDoses",
                column: "MedicationConcentrationId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationConcentrationSpeciesDoses_SpeciesId",
                table: "MedicationConcentrationSpeciesDoses",
                column: "SpeciesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MedicationConcentrationSpeciesDoses");

            migrationBuilder.DropTable(
                name: "MedicationConcentrations");

            migrationBuilder.DropColumn(
                name: "SpeciesType",
                table: "Species");

            migrationBuilder.DropColumn(
                name: "Brands",
                table: "Medications");

            migrationBuilder.DropColumn(
                name: "Code",
                table: "AdministrationMethods");

            migrationBuilder.RenameColumn(
                name: "Notes",
                table: "Medications",
                newName: "VMNo");

            migrationBuilder.RenameColumn(
                name: "ActiveSubstance",
                table: "Medications",
                newName: "VMDProductNo");

            migrationBuilder.AddColumn<bool>(
                name: "ControlledDrug",
                table: "Medications",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Distributors",
                table: "Medications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MAHolder",
                table: "Medications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Medications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PAARLink",
                table: "Medications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "PharmaceuticalFormId",
                table: "Medications",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "SPCLink",
                table: "Medications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "TherapeuticGroupId",
                table: "Medications",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "UKPARLink",
                table: "Medications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "Used",
                table: "Medications",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "ActiveSubstances",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActiveSubstances", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PharmaceuticalForms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PharmaceuticalForms", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TargetSpecies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TargetSpecies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TherapeuticGroups",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TherapeuticGroups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ActiveSubstanceMedication",
                columns: table => new
                {
                    ActiveSubstancesId = table.Column<int>(type: "integer", nullable: false),
                    MedicationsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActiveSubstanceMedication", x => new { x.ActiveSubstancesId, x.MedicationsId });
                    table.ForeignKey(
                        name: "FK_ActiveSubstanceMedication_ActiveSubstances_ActiveSubstances~",
                        column: x => x.ActiveSubstancesId,
                        principalTable: "ActiveSubstances",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ActiveSubstanceMedication_Medications_MedicationsId",
                        column: x => x.MedicationsId,
                        principalTable: "Medications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MedicationTargetSpecies",
                columns: table => new
                {
                    MedicationsId = table.Column<int>(type: "integer", nullable: false),
                    TargetSpeciesId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationTargetSpecies", x => new { x.MedicationsId, x.TargetSpeciesId });
                    table.ForeignKey(
                        name: "FK_MedicationTargetSpecies_Medications_MedicationsId",
                        column: x => x.MedicationsId,
                        principalTable: "Medications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicationTargetSpecies_TargetSpecies_TargetSpeciesId",
                        column: x => x.TargetSpeciesId,
                        principalTable: "TargetSpecies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Medications_PharmaceuticalFormId",
                table: "Medications",
                column: "PharmaceuticalFormId");

            migrationBuilder.CreateIndex(
                name: "IX_Medications_TherapeuticGroupId",
                table: "Medications",
                column: "TherapeuticGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_ActiveSubstanceMedication_MedicationsId",
                table: "ActiveSubstanceMedication",
                column: "MedicationsId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationTargetSpecies_TargetSpeciesId",
                table: "MedicationTargetSpecies",
                column: "TargetSpeciesId");

            migrationBuilder.AddForeignKey(
                name: "FK_Medications_PharmaceuticalForms_PharmaceuticalFormId",
                table: "Medications",
                column: "PharmaceuticalFormId",
                principalTable: "PharmaceuticalForms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Medications_TherapeuticGroups_TherapeuticGroupId",
                table: "Medications",
                column: "TherapeuticGroupId",
                principalTable: "TherapeuticGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
