using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class PatientLabs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PatientBloodTests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    TesterId = table.Column<int>(type: "integer", nullable: false),
                    Tested = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Comments = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientBloodTests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientBloodTests_Accounts_TesterId",
                        column: x => x.TesterId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientBloodTests_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientFaecalTests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    TesterId = table.Column<int>(type: "integer", nullable: false),
                    Tested = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Float = table.Column<bool>(type: "boolean", nullable: true),
                    Direct = table.Column<bool>(type: "boolean", nullable: true),
                    Comments = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientFaecalTests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientFaecalTests_Accounts_TesterId",
                        column: x => x.TesterId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientFaecalTests_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientBloodTestAttachments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientBloodTestId = table.Column<int>(type: "integer", nullable: false),
                    FileName = table.Column<string>(type: "text", nullable: false),
                    ContentType = table.Column<string>(type: "text", nullable: false),
                    Data = table.Column<byte[]>(type: "bytea", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientBloodTestAttachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientBloodTestAttachments_PatientBloodTests_PatientBloodT~",
                        column: x => x.PatientBloodTestId,
                        principalTable: "PatientBloodTests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PatientBloodTestAttachments_PatientBloodTestId",
                table: "PatientBloodTestAttachments",
                column: "PatientBloodTestId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientBloodTests_PatientId",
                table: "PatientBloodTests",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientBloodTests_TesterId",
                table: "PatientBloodTests",
                column: "TesterId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientFaecalTests_PatientId",
                table: "PatientFaecalTests",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientFaecalTests_TesterId",
                table: "PatientFaecalTests",
                column: "TesterId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PatientBloodTestAttachments");

            migrationBuilder.DropTable(
                name: "PatientFaecalTests");

            migrationBuilder.DropTable(
                name: "PatientBloodTests");
        }
    }
}
