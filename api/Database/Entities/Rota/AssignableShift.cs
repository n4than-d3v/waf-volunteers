namespace Api.Database.Entities.Rota;

public class AssignableShift : Entity
{
    public DayOfWeek Day { get; set; }
    public TimeRange Time { get; set; }
    public Job Job { get; set; }
}
