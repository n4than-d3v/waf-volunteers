using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAttachmentData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Data",
                table: "PatientNoteAttachments");

            migrationBuilder.DropColumn(
                name: "Data",
                table: "PatientBloodTestAttachments");

            migrationBuilder.DropColumn(
                name: "Data",
                table: "NoticeAttachments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "Data",
                table: "PatientNoteAttachments",
                type: "bytea",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<byte[]>(
                name: "Data",
                table: "PatientBloodTestAttachments",
                type: "bytea",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<byte[]>(
                name: "Data",
                table: "NoticeAttachments",
                type: "bytea",
                nullable: false,
                defaultValue: new byte[0]);
        }
    }
}
