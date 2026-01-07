using Api.Database.Entities.Hospital.Locations;
using Api.Database.Entities.Hospital.Patients.Medications;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Api.Database.Entities.Hospital.Patients.Prescriptions;

public class PatientPrescriptionMedication : Entity
{
    [JsonIgnore]
    public Patient Patient { get; set; }

    public DateOnly Start { get; set; }
    public DateOnly End { get; set; }

    public decimal QuantityValue { get; set; }
    public string QuantityUnit { get; set; }
    public Medication Medication { get; set; }
    public AdministrationMethod AdministrationMethod { get; set; }

    public string Comments { get; set; }

    public string Frequency { get; set; }

    public List<PatientPrescriptionMedicationAdministration> Administrations { get; set; }

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
