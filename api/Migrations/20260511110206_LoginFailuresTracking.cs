using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class LoginFailuresTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Password",
                table: "LoginFailures");

            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "LoginFailures");

            migrationBuilder.DropColumn(
                name: "Salt",
                table: "LoginFailures");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "LoginFailures",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "IpAddress",
                table: "LoginFailures",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "LoginFailures");

            migrationBuilder.DropColumn(
                name: "IpAddress",
                table: "LoginFailures");

            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "LoginFailures",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "LoginFailures",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Salt",
                table: "LoginFailures",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
