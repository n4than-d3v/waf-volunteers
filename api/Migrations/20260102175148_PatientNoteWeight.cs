using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class PatientNoteWeight : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
        ALTER TABLE "PatientNotes"
        ALTER COLUMN "WeightUnit"
        TYPE integer
        USING "WeightUnit"::integer;
    """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
        ALTER TABLE "PatientNotes"
        ALTER COLUMN "WeightUnit"
        TYPE text
        USING "WeightUnit"::text;
    """);
        }
    }
}
