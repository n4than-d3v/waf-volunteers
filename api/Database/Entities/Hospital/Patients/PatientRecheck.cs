using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Locations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Rechecker = Api.Database.Entities.Account.Account;

namespace Api.Database.Entities.Hospital.Patients;

public class PatientRecheck : Entity
{
    [JsonIgnore]
    public Patient Patient { get; set; }

    public DateOnly Due { get; set; }
    public string Description { get; set; }
    public RecheckRoles Roles { get; set; }

    public Rechecker? Rechecker { get; set; }
    public DateTime? Rechecked { get; set; }
    public string? Comments { get; set; }

    [NotMapped]
    public Species Species => Patient.Species;
    [NotMapped]
    public SpeciesVariant SpeciesVariant => Patient.SpeciesVariant;
    [NotMapped]
    public Pen Pen => Patient.Pen;
}

public enum RecheckRoles
{
    Vet = 1,
    Technician = 2
}