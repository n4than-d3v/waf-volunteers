using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class SimplifyAttendance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ShiftMembers");

            migrationBuilder.DropTable(
                name: "Shifts");

            migrationBuilder.CreateTable(
                name: "Attendance",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    TimeId = table.Column<int>(type: "integer", nullable: false),
                    JobId = table.Column<int>(type: "integer", nullable: false),
                    AccountId = table.Column<int>(type: "integer", nullable: false),
                    Confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    MissingReasonId = table.Column<int>(type: "integer", nullable: true),
                    CustomMissingReason = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attendance", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Attendance_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Attendance_Jobs_JobId",
                        column: x => x.JobId,
                        principalTable: "Jobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Attendance_MissingReasons_MissingReasonId",
                        column: x => x.MissingReasonId,
                        principalTable: "MissingReasons",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Attendance_TimeRanges_TimeId",
                        column: x => x.TimeId,
                        principalTable: "TimeRanges",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Attendance_AccountId",
                table: "Attendance",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Attendance_JobId",
                table: "Attendance",
                column: "JobId");

            migrationBuilder.CreateIndex(
                name: "IX_Attendance_MissingReasonId",
                table: "Attendance",
                column: "MissingReasonId");

            migrationBuilder.CreateIndex(
                name: "IX_Attendance_TimeId",
                table: "Attendance",
                column: "TimeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Attendance");

            migrationBuilder.CreateTable(
                name: "Shifts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TimeId = table.Column<int>(type: "integer", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    Day = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shifts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Shifts_TimeRanges_TimeId",
                        column: x => x.TimeId,
                        principalTable: "TimeRanges",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ShiftMembers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AccountId = table.Column<int>(type: "integer", nullable: false),
                    JobId = table.Column<int>(type: "integer", nullable: false),
                    MissingReasonId = table.Column<int>(type: "integer", nullable: true),
                    ShiftId = table.Column<int>(type: "integer", nullable: false),
                    Confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    CustomMissingReason = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShiftMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShiftMembers_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ShiftMembers_Jobs_JobId",
                        column: x => x.JobId,
                        principalTable: "Jobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ShiftMembers_MissingReasons_MissingReasonId",
                        column: x => x.MissingReasonId,
                        principalTable: "MissingReasons",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ShiftMembers_Shifts_ShiftId",
                        column: x => x.ShiftId,
                        principalTable: "Shifts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ShiftMembers_AccountId",
                table: "ShiftMembers",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_ShiftMembers_JobId",
                table: "ShiftMembers",
                column: "JobId");

            migrationBuilder.CreateIndex(
                name: "IX_ShiftMembers_MissingReasonId",
                table: "ShiftMembers",
                column: "MissingReasonId");

            migrationBuilder.CreateIndex(
                name: "IX_ShiftMembers_ShiftId",
                table: "ShiftMembers",
                column: "ShiftId");

            migrationBuilder.CreateIndex(
                name: "IX_Shifts_TimeId",
                table: "Shifts",
                column: "TimeId");
        }
    }
}
