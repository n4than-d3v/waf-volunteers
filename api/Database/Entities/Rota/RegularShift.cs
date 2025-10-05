namespace Api.Database.Entities.Rota;

public class RegularShift : Entity
{
    public Account.Account Account { get; set; }

    public DayOfWeek Day { get; set; }
    public TimeRange Time { get; set; }
    public Job Job { get; set; }
}
