using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class StockManagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StockItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MedicationId = table.Column<int>(type: "integer", nullable: false),
                    MedicationConcentrationId = table.Column<int>(type: "integer", nullable: false),
                    Brand = table.Column<string>(type: "text", nullable: false),
                    Measurement = table.Column<int>(type: "integer", nullable: false),
                    AfterOpeningLifetimeDays = table.Column<int>(type: "integer", nullable: false),
                    ReorderQuantity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockItems_MedicationConcentrations_MedicationConcentration~",
                        column: x => x.MedicationConcentrationId,
                        principalTable: "MedicationConcentrations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StockItems_Medications_MedicationId",
                        column: x => x.MedicationId,
                        principalTable: "Medications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StockItemBatches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ItemId = table.Column<int>(type: "integer", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Number = table.Column<string>(type: "text", nullable: false),
                    Expiry = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    Initials = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockItemBatches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockItemBatches_StockItems_ItemId",
                        column: x => x.ItemId,
                        principalTable: "StockItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StockItemBatchUsages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BatchId = table.Column<int>(type: "integer", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Expiry = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    SignedOutBy = table.Column<string>(type: "text", nullable: false),
                    Disposed = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DisposedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockItemBatchUsages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockItemBatchUsages_StockItemBatches_BatchId",
                        column: x => x.BatchId,
                        principalTable: "StockItemBatches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StockItemBatches_ItemId",
                table: "StockItemBatches",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_StockItemBatchUsages_BatchId",
                table: "StockItemBatchUsages",
                column: "BatchId");

            migrationBuilder.CreateIndex(
                name: "IX_StockItems_MedicationConcentrationId",
                table: "StockItems",
                column: "MedicationConcentrationId");

            migrationBuilder.CreateIndex(
                name: "IX_StockItems_MedicationId",
                table: "StockItems",
                column: "MedicationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StockItemBatchUsages");

            migrationBuilder.DropTable(
                name: "StockItemBatches");

            migrationBuilder.DropTable(
                name: "StockItems");
        }
    }
}
