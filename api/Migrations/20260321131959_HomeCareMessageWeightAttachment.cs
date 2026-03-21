using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class HomeCareMessageWeightAttachment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "WeightUnit",
                table: "HomeCareMessages",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "WeightValue",
                table: "HomeCareMessages",
                type: "numeric",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "HomeCareMessageAttachment",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    HomeCareMessageId = table.Column<int>(type: "integer", nullable: false),
                    FileName = table.Column<string>(type: "text", nullable: false),
                    ContentType = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomeCareMessageAttachment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HomeCareMessageAttachment_HomeCareMessages_HomeCareMessageId",
                        column: x => x.HomeCareMessageId,
                        principalTable: "HomeCareMessages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HomeCareMessageAttachment_HomeCareMessageId",
                table: "HomeCareMessageAttachment",
                column: "HomeCareMessageId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HomeCareMessageAttachment");

            migrationBuilder.DropColumn(
                name: "WeightUnit",
                table: "HomeCareMessages");

            migrationBuilder.DropColumn(
                name: "WeightValue",
                table: "HomeCareMessages");
        }
    }
}
