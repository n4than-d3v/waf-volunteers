namespace Api.Database.Entities.Rota;

public class Newbie : Entity
{
    public DateOnly Date { get; set; }
    public TimeRange Time { get; set; }
    public Job Job { get; set; }
    public string Name { get; set; }
}
