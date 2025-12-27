namespace Api.Database.Entities.Hospital.Locations;

public class Area : Entity
{
    public string Name { get; set; }
    public string Code { get; set; }

    public List<Pen> Pens { get; set; }
}
