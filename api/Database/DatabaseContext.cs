﻿using Api.Database.Entities.Account;
using Api.Database.Entities.Rota;
using Microsoft.EntityFrameworkCore;

namespace Api.Database;

public class DatabaseContext : DbContext
{
    // Account management
    public DbSet<Account> Accounts { get; set; }
    public DbSet<ResetPasswordRequest> ResetPasswordRequests { get; set; }

    // Rota management
    public DbSet<Attendance> Attendance { get; set; }
    public DbSet<TimeRange> TimeRanges { get; set; }
    public DbSet<Job> Jobs { get; set; }
    public DbSet<MissingReason> MissingReasons { get; set; }
    public DbSet<RegularShift> RegularShifts { get; set; }
    public DbSet<Requirement> Requirements { get; set; }

    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }
}
