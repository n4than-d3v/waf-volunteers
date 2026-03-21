using Api.Database.Entities.Account;

namespace Api.Database.Entities.Hospital.Patients;

public class Species : Entity
{
    public string Name { get; set; }
    public SpeciesType SpeciesType { get; set; }
    public HomeCarerPermissions? HomeCarerPermissions { get; set; }
    public List<SpeciesVariant> Variants { get; set; }
}

public enum SpeciesType
{
    Mammal = 1,
    Bird = 2,
    Amphibian = 3,
    Reptile = 4,

    Waterfowl = 5,
    Pigeons = 6,
    Raptors = 7,
    Rodents = 8
}
