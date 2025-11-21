namespace Api.Database.Entities.Rota;

public class AttendanceClocking:Entity
{
    public Attendance Attendance { get; set; }

    public string? Car { get; set; }
    public TimeOnly In { get; set; }
    public TimeOnly? Out { get; set; }
}
