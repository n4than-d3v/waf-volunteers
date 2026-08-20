using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class NoticeQuestions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NoticeQuestion",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    AllowMultiple = table.Column<bool>(type: "boolean", nullable: false),
                    AllowOther = table.Column<bool>(type: "boolean", nullable: false),
                    Answers = table.Column<string[]>(type: "text[]", nullable: false),
                    NoticeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoticeQuestion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NoticeQuestion_Notices_NoticeId",
                        column: x => x.NoticeId,
                        principalTable: "Notices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NoticeQuestionResponse",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    QuestionId = table.Column<int>(type: "integer", nullable: false),
                    ResponderId = table.Column<int>(type: "integer", nullable: false),
                    Responded = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Answers = table.Column<string[]>(type: "text[]", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoticeQuestionResponse", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NoticeQuestionResponse_Accounts_ResponderId",
                        column: x => x.ResponderId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NoticeQuestionResponse_NoticeQuestion_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "NoticeQuestion",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NoticeQuestion_NoticeId",
                table: "NoticeQuestion",
                column: "NoticeId");

            migrationBuilder.CreateIndex(
                name: "IX_NoticeQuestionResponse_QuestionId",
                table: "NoticeQuestionResponse",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_NoticeQuestionResponse_ResponderId",
                table: "NoticeQuestionResponse",
                column: "ResponderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NoticeQuestionResponse");

            migrationBuilder.DropTable(
                name: "NoticeQuestion");
        }
    }
}
