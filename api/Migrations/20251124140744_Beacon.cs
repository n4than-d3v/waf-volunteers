using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class Beacon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AddressCity",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "AddressCounty",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "AddressLineOne",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "AddressLineTwo",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "AddressPostcode",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "CreationDate",
                table: "Accounts");

            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "Accounts",
                newName: "BeaconInfo");

            migrationBuilder.AddColumn<int>(
                name: "BeaconId",
                table: "Accounts",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BeaconId",
                table: "Accounts");

            migrationBuilder.RenameColumn(
                name: "BeaconInfo",
                table: "Accounts",
                newName: "Phone");

            migrationBuilder.AddColumn<string>(
                name: "AddressCity",
                table: "Accounts",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AddressCounty",
                table: "Accounts",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AddressLineOne",
                table: "Accounts",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AddressLineTwo",
                table: "Accounts",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AddressPostcode",
                table: "Accounts",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateOnly>(
                name: "CreationDate",
                table: "Accounts",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));
        }
    }
}
