namespace Api.Database.Entities.Rota;

public class Attendance : Entity
{
    public DateOnly Date { get; set; }
    public TimeRange Time { get; set; }
    public Job Job { get; set; }
    public Account.Account Account { get; set; }
    public AttendanceType Type { get; set; }

    public bool Confirmed { get; set; }
    public MissingReason? MissingReason { get; set; }
    public string? CustomMissingReason { get; set; }
}

public enum AttendanceType
{
    Regular = 1,
    Urgent = 2,
    Extra = 3
}