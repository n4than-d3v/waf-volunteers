using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class OtherShiftOptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShowOthersInOtherJobsOnShift",
                table: "Jobs");

            migrationBuilder.AddColumn<int[]>(
                name: "CanAlsoDoJobIds",
                table: "Jobs",
                type: "integer[]",
                nullable: false,
                defaultValue: new int[0]);

            migrationBuilder.AddColumn<int[]>(
                name: "ShowOthersInJobIds",
                table: "Jobs",
                type: "integer[]",
                nullable: false,
                defaultValue: new int[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CanAlsoDoJobIds",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "ShowOthersInJobIds",
                table: "Jobs");

            migrationBuilder.AddColumn<bool>(
                name: "ShowOthersInOtherJobsOnShift",
                table: "Jobs",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
