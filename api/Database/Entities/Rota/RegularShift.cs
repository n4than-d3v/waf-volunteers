namespace Api.Database.Entities.Rota;

public class RegularShift : Entity
{
    public Account.Account Account { get; set; }

    public DayOfWeek Day { get; set; }
    /// <summary>
    /// Week, used for Saturdays and Sundays
    /// Either 1 or 2, depending on which week
    /// </summary>
    public int? Week { get; set; }
    public TimeRange Time { get; set; }
    public Job Job { get; set; }
}
