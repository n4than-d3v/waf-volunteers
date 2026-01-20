using Api.Database.Entities.Hospital.Locations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Prescriptions;

public class PatientPrescriptionInstruction : Entity
{
    [JsonIgnore]
    public Patient Patient { get; set; }

    public DateOnly Start { get; set; }
    public DateOnly End { get; set; }

    public string Instructions { get; set; }

    public string Frequency { get; set; }

    public List<PatientPrescriptionInstructionAdministration> Administrations { get; set; }

    [NotMapped]
    public int ViewPatientId => Patient.Id;
    [NotMapped]
    public string Reference => Patient.Reference;
    [NotMapped]
    public string UniqueIdentifier => Patient.UniqueIdentifier;
    [NotMapped]
    public Species Species => Patient.Species;
    [NotMapped]
    public SpeciesVariant Variant => Patient.SpeciesVariant;
    [NotMapped]
    public Pen Pen => Patient.Pen;
}
