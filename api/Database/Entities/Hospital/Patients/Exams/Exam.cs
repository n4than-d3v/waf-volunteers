using System.Text.Json.Serialization;
using Examiner = Api.Database.Entities.Account.Account;

namespace Api.Database.Entities.Hospital.Patients.Exams;

public class Exam : Entity
{
    [JsonIgnore]
    public Patient Patient { get; set; }

    public Examiner Examiner { get; set; }
    public DateTime Date { get; set; }
    public ExamType Type { get; set; }
    public Species Species { get; set; }
    public SpeciesVariant SpeciesVariant { get; set; }
    public Sex Sex { get; set; }
    public decimal? WeightValue { get; set; }
    public WeightUnit? WeightUnit { get; set; }
    public decimal? Temperature { get; set; }
    public Attitude? Attitude { get; set; }
    public BodyCondition? BodyCondition { get; set; }
    public Dehydration? Dehydration { get; set; }
    public MucousMembraneColour? MucousMembraneColour { get; set; }
    public MucousMembraneTexture? MucousMembraneTexture { get; set; }
    public List<ExamTreatmentInstruction> TreatmentInstructions { get; set; }
    public List<ExamTreatmentMedication> TreatmentMedications { get; set; }
    public string Comments { get; set; }
}

public enum ExamType
{
    Intake = 1,
    Regular = 2
}

public enum Sex
{
    Male = 1,
    Female = 2,
    Unknown = 3
}

public enum WeightUnit
{
    G = 1,
    KG = 2,
    OZ = 3,
    LBS = 4
}