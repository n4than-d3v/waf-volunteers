namespace Api.Database.Entities.Rota;

public class TimeRange : Entity
{
    public string Name { get; set; }
    public TimeOnly Start { get; set; }
    public TimeOnly End { get; set; }

    public string BeaconName { get; set; }
}
