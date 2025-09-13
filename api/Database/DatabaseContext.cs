using Api.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Api.Database;

public class DatabaseContext : DbContext
{
    public DbSet<Account> Accounts { get; set; }

    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }
}
