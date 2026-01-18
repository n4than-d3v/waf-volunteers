using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class AuxDevPlans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AuxDevPlanTasks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Explanation = table.Column<string>(type: "text", nullable: false),
                    YouTube = table.Column<string[]>(type: "text[]", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuxDevPlanTasks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AuxDevPlanTaskWitnesses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TaskId = table.Column<int>(type: "integer", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PerformedById = table.Column<int>(type: "integer", nullable: false),
                    WitnessedById = table.Column<int>(type: "integer", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: false),
                    SignedOff = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuxDevPlanTaskWitnesses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AuxDevPlanTaskWitnesses_Accounts_PerformedById",
                        column: x => x.PerformedById,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AuxDevPlanTaskWitnesses_Accounts_WitnessedById",
                        column: x => x.WitnessedById,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AuxDevPlanTaskWitnesses_AuxDevPlanTasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "AuxDevPlanTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuxDevPlanTaskWitnesses_PerformedById",
                table: "AuxDevPlanTaskWitnesses",
                column: "PerformedById");

            migrationBuilder.CreateIndex(
                name: "IX_AuxDevPlanTaskWitnesses_TaskId",
                table: "AuxDevPlanTaskWitnesses",
                column: "TaskId");

            migrationBuilder.CreateIndex(
                name: "IX_AuxDevPlanTaskWitnesses_WitnessedById",
                table: "AuxDevPlanTaskWitnesses",
                column: "WitnessedById");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuxDevPlanTaskWitnesses");

            migrationBuilder.DropTable(
                name: "AuxDevPlanTasks");
        }
    }
}
