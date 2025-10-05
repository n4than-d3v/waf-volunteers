namespace Api.Database.Entities.Rota;

public class Requirement : Entity
{
    public DayOfWeek Day { get; set; }
    public TimeRange Time { get; set; }
    public Job Job { get; set; }
    public int Minimum { get; set; }
}
