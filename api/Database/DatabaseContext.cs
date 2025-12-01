using Api.Database.Entities.Account;
using Api.Database.Entities.Notices;
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
    public DbSet<AttendanceClocking> AttendanceClockings { get; set; }
    public DbSet<TimeRange> TimeRanges { get; set; }
    public DbSet<Job> Jobs { get; set; }
    public DbSet<MissingReason> MissingReasons { get; set; }
    public DbSet<RegularShift> RegularShifts { get; set; }
    public DbSet<Requirement> Requirements { get; set; }

    // Assignments on shift
    public DbSet<AssignableArea> AssignableAreas { get; set; }
    public DbSet<AssignableShift> AssignableShifts { get; set; }
    public DbSet<Assignment> Assignments { get; set; }

    // Notices
    public DbSet<Notice> Notices { get; set; }
    public DbSet<NoticeAttachment> NoticeAttachments { get; set; }
    public DbSet<NoticeInteraction> NoticeInteractions { get; set; }

    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }
}
