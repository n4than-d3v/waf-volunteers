using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class Hospital : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                name: "AdministrationMethods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdministrationMethods", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AdmissionReasons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdmissionReasons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Admitters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BeaconId = table.Column<int>(type: "integer", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: false),
                    Telephone = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Salt = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admitters", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Areas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Areas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Attitudes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attitudes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BodyConditions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BodyConditions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Dehydrations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dehydrations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Diets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Diets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DispositionReasons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Communication = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DispositionReasons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InitialLocations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InitialLocations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MucousMembraneColours",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MucousMembraneColours", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MucousMembraneTextures",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MucousMembraneTextures", x => x.Id);
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
                name: "ReleaseTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReleaseTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Species",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Species", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SuspectedSpecies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SuspectedSpecies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.Id);
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
                name: "TransferLocations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransferLocations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Pens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AreaId = table.Column<int>(type: "integer", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pens_Areas_AreaId",
                        column: x => x.AreaId,
                        principalTable: "Areas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpeciesVariants",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SpeciesId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    FeedingGuidance = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpeciesVariants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SpeciesVariants_Species_SpeciesId",
                        column: x => x.SpeciesId,
                        principalTable: "Species",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Medications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    VMDProductNo = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    MAHolder = table.Column<string>(type: "text", nullable: false),
                    Distributors = table.Column<string>(type: "text", nullable: false),
                    VMNo = table.Column<string>(type: "text", nullable: false),
                    ControlledDrug = table.Column<bool>(type: "boolean", nullable: false),
                    PharmaceuticalFormId = table.Column<int>(type: "integer", nullable: false),
                    TherapeuticGroupId = table.Column<int>(type: "integer", nullable: false),
                    SPCLink = table.Column<string>(type: "text", nullable: false),
                    UKPARLink = table.Column<string>(type: "text", nullable: false),
                    PAARLink = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Medications_PharmaceuticalForms_PharmaceuticalFormId",
                        column: x => x.PharmaceuticalFormId,
                        principalTable: "PharmaceuticalForms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Medications_TherapeuticGroups_TherapeuticGroupId",
                        column: x => x.TherapeuticGroupId,
                        principalTable: "TherapeuticGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BeaconId = table.Column<int>(type: "integer", nullable: false),
                    Admitted = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AdmitterId = table.Column<int>(type: "integer", nullable: true),
                    FoundAt = table.Column<string>(type: "text", nullable: false),
                    InitialLocationId = table.Column<int>(type: "integer", nullable: false),
                    SuspectedSpeciesId = table.Column<int>(type: "integer", nullable: false),
                    Reference = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    UniqueIdentifier = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    PenId = table.Column<int>(type: "integer", nullable: true),
                    Disposition = table.Column<int>(type: "integer", nullable: true),
                    Dispositioned = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DispositionReasonId = table.Column<int>(type: "integer", nullable: true),
                    ReleaseTypeId = table.Column<int>(type: "integer", nullable: true),
                    TransferLocationId = table.Column<int>(type: "integer", nullable: true),
                    DispositionerId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Patients_Accounts_DispositionerId",
                        column: x => x.DispositionerId,
                        principalTable: "Accounts",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Patients_Admitters_AdmitterId",
                        column: x => x.AdmitterId,
                        principalTable: "Admitters",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Patients_DispositionReasons_DispositionReasonId",
                        column: x => x.DispositionReasonId,
                        principalTable: "DispositionReasons",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Patients_InitialLocations_InitialLocationId",
                        column: x => x.InitialLocationId,
                        principalTable: "InitialLocations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Patients_Pens_PenId",
                        column: x => x.PenId,
                        principalTable: "Pens",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Patients_ReleaseTypes_ReleaseTypeId",
                        column: x => x.ReleaseTypeId,
                        principalTable: "ReleaseTypes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Patients_SuspectedSpecies_SuspectedSpeciesId",
                        column: x => x.SuspectedSpeciesId,
                        principalTable: "SuspectedSpecies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Patients_TransferLocations_TransferLocationId",
                        column: x => x.TransferLocationId,
                        principalTable: "TransferLocations",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SpeciesAges",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SpeciesId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    AssociatedVariantId = table.Column<int>(type: "integer", nullable: false)
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

            migrationBuilder.CreateTable(
                name: "AdmissionReasonPatient",
                columns: table => new
                {
                    AdmissionReasonsId = table.Column<int>(type: "integer", nullable: false),
                    PatientsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdmissionReasonPatient", x => new { x.AdmissionReasonsId, x.PatientsId });
                    table.ForeignKey(
                        name: "FK_AdmissionReasonPatient_AdmissionReasons_AdmissionReasonsId",
                        column: x => x.AdmissionReasonsId,
                        principalTable: "AdmissionReasons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AdmissionReasonPatient_Patients_PatientsId",
                        column: x => x.PatientsId,
                        principalTable: "Patients",
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

            migrationBuilder.CreateTable(
                name: "HomeCareMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    AuthorId = table.Column<int>(type: "integer", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomeCareMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HomeCareMessages_Accounts_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HomeCareMessages_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HomeCareRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    RequesterId = table.Column<int>(type: "integer", nullable: false),
                    Requested = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: false),
                    ResponderId = table.Column<int>(type: "integer", nullable: true),
                    Responded = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Pickup = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Dropoff = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomeCareRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HomeCareRequests_Accounts_RequesterId",
                        column: x => x.RequesterId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HomeCareRequests_Accounts_ResponderId",
                        column: x => x.ResponderId,
                        principalTable: "Accounts",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_HomeCareRequests_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientMovements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    Moved = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    FromId = table.Column<int>(type: "integer", nullable: false),
                    ToId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientMovements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientMovements_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientMovements_Pens_FromId",
                        column: x => x.FromId,
                        principalTable: "Pens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientMovements_Pens_ToId",
                        column: x => x.ToId,
                        principalTable: "Pens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientNotes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    NoterId = table.Column<int>(type: "integer", nullable: false),
                    Noted = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    WeightValue = table.Column<decimal>(type: "numeric", nullable: true),
                    WeightUnit = table.Column<string>(type: "text", nullable: true),
                    Comments = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientNotes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientNotes_Accounts_NoterId",
                        column: x => x.NoterId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientNotes_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientPrescriptionInstructions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    Start = table.Column<DateOnly>(type: "date", nullable: false),
                    End = table.Column<DateOnly>(type: "date", nullable: false),
                    Instructions = table.Column<string>(type: "text", nullable: false),
                    Frequency = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientPrescriptionInstructions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientPrescriptionInstructions_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientPrescriptionMedications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    Start = table.Column<DateOnly>(type: "date", nullable: false),
                    End = table.Column<DateOnly>(type: "date", nullable: false),
                    QuantityValue = table.Column<decimal>(type: "numeric", nullable: false),
                    QuantityUnit = table.Column<string>(type: "text", nullable: false),
                    MedicationId = table.Column<int>(type: "integer", nullable: false),
                    AdministrationMethodId = table.Column<int>(type: "integer", nullable: false),
                    Comments = table.Column<string>(type: "text", nullable: false),
                    Frequency = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientPrescriptionMedications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientPrescriptionMedications_AdministrationMethods_Admini~",
                        column: x => x.AdministrationMethodId,
                        principalTable: "AdministrationMethods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientPrescriptionMedications_Medications_MedicationId",
                        column: x => x.MedicationId,
                        principalTable: "Medications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientPrescriptionMedications_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientRechecks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    Due = table.Column<DateOnly>(type: "date", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Roles = table.Column<int>(type: "integer", nullable: false),
                    RecheckerId = table.Column<int>(type: "integer", nullable: true),
                    Rechecked = table.Column<DateOnly>(type: "date", nullable: true),
                    Comments = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientRechecks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientRechecks_Accounts_RecheckerId",
                        column: x => x.RecheckerId,
                        principalTable: "Accounts",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PatientRechecks_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientTag",
                columns: table => new
                {
                    PatientsId = table.Column<int>(type: "integer", nullable: false),
                    TagsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientTag", x => new { x.PatientsId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_PatientTag_Patients_PatientsId",
                        column: x => x.PatientsId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientTag_Tags_TagsId",
                        column: x => x.TagsId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Exams",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    ExaminerId = table.Column<int>(type: "integer", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    SpeciesId = table.Column<int>(type: "integer", nullable: false),
                    SpeciesAgeId = table.Column<int>(type: "integer", nullable: false),
                    Sex = table.Column<int>(type: "integer", nullable: false),
                    WeightValue = table.Column<decimal>(type: "numeric", nullable: true),
                    WeightUnit = table.Column<int>(type: "integer", nullable: true),
                    TemperatureValue = table.Column<decimal>(type: "numeric", nullable: true),
                    TemperatureUnit = table.Column<int>(type: "integer", nullable: true),
                    AttitudeId = table.Column<int>(type: "integer", nullable: true),
                    BodyConditionId = table.Column<int>(type: "integer", nullable: true),
                    DehydrationId = table.Column<int>(type: "integer", nullable: true),
                    MucousMembraneColourId = table.Column<int>(type: "integer", nullable: true),
                    MucousMembraneTextureId = table.Column<int>(type: "integer", nullable: true),
                    Comments = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Exams", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Exams_Accounts_ExaminerId",
                        column: x => x.ExaminerId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Exams_Attitudes_AttitudeId",
                        column: x => x.AttitudeId,
                        principalTable: "Attitudes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Exams_BodyConditions_BodyConditionId",
                        column: x => x.BodyConditionId,
                        principalTable: "BodyConditions",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Exams_Dehydrations_DehydrationId",
                        column: x => x.DehydrationId,
                        principalTable: "Dehydrations",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Exams_MucousMembraneColours_MucousMembraneColourId",
                        column: x => x.MucousMembraneColourId,
                        principalTable: "MucousMembraneColours",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Exams_MucousMembraneTextures_MucousMembraneTextureId",
                        column: x => x.MucousMembraneTextureId,
                        principalTable: "MucousMembraneTextures",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Exams_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Exams_SpeciesAges_SpeciesAgeId",
                        column: x => x.SpeciesAgeId,
                        principalTable: "SpeciesAges",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Exams_Species_SpeciesId",
                        column: x => x.SpeciesId,
                        principalTable: "Species",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientPrescriptionInstructionAdministrations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientPrescriptionInstructionId = table.Column<int>(type: "integer", nullable: false),
                    Administered = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AdministratorId = table.Column<int>(type: "integer", nullable: false),
                    Success = table.Column<bool>(type: "boolean", nullable: false),
                    Comments = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientPrescriptionInstructionAdministrations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientPrescriptionInstructionAdministrations_Accounts_Admi~",
                        column: x => x.AdministratorId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientPrescriptionInstructionAdministrations_PatientPrescr~",
                        column: x => x.PatientPrescriptionInstructionId,
                        principalTable: "PatientPrescriptionInstructions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientPrescriptionMedicationAdministrations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientPrescriptionMedicationId = table.Column<int>(type: "integer", nullable: false),
                    Administered = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AdministratorId = table.Column<int>(type: "integer", nullable: false),
                    Success = table.Column<bool>(type: "boolean", nullable: false),
                    Comments = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientPrescriptionMedicationAdministrations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientPrescriptionMedicationAdministrations_Accounts_Admin~",
                        column: x => x.AdministratorId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientPrescriptionMedicationAdministrations_PatientPrescri~",
                        column: x => x.PatientPrescriptionMedicationId,
                        principalTable: "PatientPrescriptionMedications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ExamTreatmentInstructions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ExamId = table.Column<int>(type: "integer", nullable: false),
                    Instructions = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExamTreatmentInstructions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExamTreatmentInstructions_Exams_ExamId",
                        column: x => x.ExamId,
                        principalTable: "Exams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ExamTreatmentMedications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ExamId = table.Column<int>(type: "integer", nullable: false),
                    QuantityValue = table.Column<decimal>(type: "numeric", nullable: false),
                    QuantityUnit = table.Column<string>(type: "text", nullable: false),
                    MedicationId = table.Column<int>(type: "integer", nullable: false),
                    AdministrationMethodId = table.Column<int>(type: "integer", nullable: false),
                    Comments = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExamTreatmentMedications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExamTreatmentMedications_AdministrationMethods_Administrati~",
                        column: x => x.AdministrationMethodId,
                        principalTable: "AdministrationMethods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ExamTreatmentMedications_Exams_ExamId",
                        column: x => x.ExamId,
                        principalTable: "Exams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ExamTreatmentMedications_Medications_MedicationId",
                        column: x => x.MedicationId,
                        principalTable: "Medications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ActiveSubstanceMedication_MedicationsId",
                table: "ActiveSubstanceMedication",
                column: "MedicationsId");

            migrationBuilder.CreateIndex(
                name: "IX_AdmissionReasonPatient_PatientsId",
                table: "AdmissionReasonPatient",
                column: "PatientsId");

            migrationBuilder.CreateIndex(
                name: "IX_DietPatient_PatientsId",
                table: "DietPatient",
                column: "PatientsId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_AttitudeId",
                table: "Exams",
                column: "AttitudeId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_BodyConditionId",
                table: "Exams",
                column: "BodyConditionId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_DehydrationId",
                table: "Exams",
                column: "DehydrationId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_ExaminerId",
                table: "Exams",
                column: "ExaminerId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_MucousMembraneColourId",
                table: "Exams",
                column: "MucousMembraneColourId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_MucousMembraneTextureId",
                table: "Exams",
                column: "MucousMembraneTextureId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_PatientId",
                table: "Exams",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_SpeciesAgeId",
                table: "Exams",
                column: "SpeciesAgeId");

            migrationBuilder.CreateIndex(
                name: "IX_Exams_SpeciesId",
                table: "Exams",
                column: "SpeciesId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamTreatmentInstructions_ExamId",
                table: "ExamTreatmentInstructions",
                column: "ExamId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamTreatmentMedications_AdministrationMethodId",
                table: "ExamTreatmentMedications",
                column: "AdministrationMethodId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamTreatmentMedications_ExamId",
                table: "ExamTreatmentMedications",
                column: "ExamId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamTreatmentMedications_MedicationId",
                table: "ExamTreatmentMedications",
                column: "MedicationId");

            migrationBuilder.CreateIndex(
                name: "IX_HomeCareMessages_AuthorId",
                table: "HomeCareMessages",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_HomeCareMessages_PatientId",
                table: "HomeCareMessages",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_HomeCareRequests_PatientId",
                table: "HomeCareRequests",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_HomeCareRequests_RequesterId",
                table: "HomeCareRequests",
                column: "RequesterId");

            migrationBuilder.CreateIndex(
                name: "IX_HomeCareRequests_ResponderId",
                table: "HomeCareRequests",
                column: "ResponderId");

            migrationBuilder.CreateIndex(
                name: "IX_Medications_PharmaceuticalFormId",
                table: "Medications",
                column: "PharmaceuticalFormId");

            migrationBuilder.CreateIndex(
                name: "IX_Medications_TherapeuticGroupId",
                table: "Medications",
                column: "TherapeuticGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationTargetSpecies_TargetSpeciesId",
                table: "MedicationTargetSpecies",
                column: "TargetSpeciesId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientMovements_FromId",
                table: "PatientMovements",
                column: "FromId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientMovements_PatientId",
                table: "PatientMovements",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientMovements_ToId",
                table: "PatientMovements",
                column: "ToId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientNotes_NoterId",
                table: "PatientNotes",
                column: "NoterId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientNotes_PatientId",
                table: "PatientNotes",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientPrescriptionInstructionAdministrations_Administrator~",
                table: "PatientPrescriptionInstructionAdministrations",
                column: "AdministratorId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientPrescriptionInstructionAdministrations_PatientPrescr~",
                table: "PatientPrescriptionInstructionAdministrations",
                column: "PatientPrescriptionInstructionId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientPrescriptionInstructions_PatientId",
                table: "PatientPrescriptionInstructions",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientPrescriptionMedicationAdministrations_AdministratorId",
                table: "PatientPrescriptionMedicationAdministrations",
                column: "AdministratorId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientPrescriptionMedicationAdministrations_PatientPrescri~",
                table: "PatientPrescriptionMedicationAdministrations",
                column: "PatientPrescriptionMedicationId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientPrescriptionMedications_AdministrationMethodId",
                table: "PatientPrescriptionMedications",
                column: "AdministrationMethodId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientPrescriptionMedications_MedicationId",
                table: "PatientPrescriptionMedications",
                column: "MedicationId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientPrescriptionMedications_PatientId",
                table: "PatientPrescriptionMedications",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientRechecks_PatientId",
                table: "PatientRechecks",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientRechecks_RecheckerId",
                table: "PatientRechecks",
                column: "RecheckerId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_AdmitterId",
                table: "Patients",
                column: "AdmitterId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_DispositionerId",
                table: "Patients",
                column: "DispositionerId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_DispositionReasonId",
                table: "Patients",
                column: "DispositionReasonId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_InitialLocationId",
                table: "Patients",
                column: "InitialLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_PenId",
                table: "Patients",
                column: "PenId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_ReleaseTypeId",
                table: "Patients",
                column: "ReleaseTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_SuspectedSpeciesId",
                table: "Patients",
                column: "SuspectedSpeciesId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_TransferLocationId",
                table: "Patients",
                column: "TransferLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientTag_TagsId",
                table: "PatientTag",
                column: "TagsId");

            migrationBuilder.CreateIndex(
                name: "IX_Pens_AreaId",
                table: "Pens",
                column: "AreaId");

            migrationBuilder.CreateIndex(
                name: "IX_SpeciesAges_AssociatedVariantId",
                table: "SpeciesAges",
                column: "AssociatedVariantId");

            migrationBuilder.CreateIndex(
                name: "IX_SpeciesAges_SpeciesId",
                table: "SpeciesAges",
                column: "SpeciesId");

            migrationBuilder.CreateIndex(
                name: "IX_SpeciesVariants_SpeciesId",
                table: "SpeciesVariants",
                column: "SpeciesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActiveSubstanceMedication");

            migrationBuilder.DropTable(
                name: "AdmissionReasonPatient");

            migrationBuilder.DropTable(
                name: "DietPatient");

            migrationBuilder.DropTable(
                name: "ExamTreatmentInstructions");

            migrationBuilder.DropTable(
                name: "ExamTreatmentMedications");

            migrationBuilder.DropTable(
                name: "HomeCareMessages");

            migrationBuilder.DropTable(
                name: "HomeCareRequests");

            migrationBuilder.DropTable(
                name: "MedicationTargetSpecies");

            migrationBuilder.DropTable(
                name: "PatientMovements");

            migrationBuilder.DropTable(
                name: "PatientNotes");

            migrationBuilder.DropTable(
                name: "PatientPrescriptionInstructionAdministrations");

            migrationBuilder.DropTable(
                name: "PatientPrescriptionMedicationAdministrations");

            migrationBuilder.DropTable(
                name: "PatientRechecks");

            migrationBuilder.DropTable(
                name: "PatientTag");

            migrationBuilder.DropTable(
                name: "ActiveSubstances");

            migrationBuilder.DropTable(
                name: "AdmissionReasons");

            migrationBuilder.DropTable(
                name: "Diets");

            migrationBuilder.DropTable(
                name: "Exams");

            migrationBuilder.DropTable(
                name: "TargetSpecies");

            migrationBuilder.DropTable(
                name: "PatientPrescriptionInstructions");

            migrationBuilder.DropTable(
                name: "PatientPrescriptionMedications");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DropTable(
                name: "Attitudes");

            migrationBuilder.DropTable(
                name: "BodyConditions");

            migrationBuilder.DropTable(
                name: "Dehydrations");

            migrationBuilder.DropTable(
                name: "MucousMembraneColours");

            migrationBuilder.DropTable(
                name: "MucousMembraneTextures");

            migrationBuilder.DropTable(
                name: "SpeciesAges");

            migrationBuilder.DropTable(
                name: "AdministrationMethods");

            migrationBuilder.DropTable(
                name: "Medications");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "SpeciesVariants");

            migrationBuilder.DropTable(
                name: "PharmaceuticalForms");

            migrationBuilder.DropTable(
                name: "TherapeuticGroups");

            migrationBuilder.DropTable(
                name: "Admitters");

            migrationBuilder.DropTable(
                name: "DispositionReasons");

            migrationBuilder.DropTable(
                name: "InitialLocations");

            migrationBuilder.DropTable(
                name: "Pens");

            migrationBuilder.DropTable(
                name: "ReleaseTypes");

            migrationBuilder.DropTable(
                name: "SuspectedSpecies");

            migrationBuilder.DropTable(
                name: "TransferLocations");

            migrationBuilder.DropTable(
                name: "Species");

            migrationBuilder.DropTable(
                name: "Areas");
        }
    }
}
