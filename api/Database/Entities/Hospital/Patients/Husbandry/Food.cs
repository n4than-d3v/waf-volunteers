
namespace Api.Database.Entities.Hospital.Patients.Husbandry;

public class Food : Entity
{
    public string Name { get; set; }
    public string? Notes { get; set; }

    public string? Substitute { get; set; }

    public bool ForceFeed { get; set; } = false;
    public bool SumUp { get; set; } = false;
}
