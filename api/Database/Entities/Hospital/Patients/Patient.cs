using Api.Database.Entities.Hospital.Locations;
using Api.Database.Entities.Hospital.Patients.Admission;
using Api.Database.Entities.Hospital.Patients.Exams;
using Api.Database.Entities.Hospital.Patients.HomeCare;
using Api.Database.Entities.Hospital.Patients.Husbandry;
using Api.Database.Entities.Hospital.Patients.Labs;
using Api.Database.Entities.Hospital.Patients.Outcome;
using Api.Database.Entities.Hospital.Patients.Prescriptions;
using System.ComponentModel.DataAnnotations.Schema;
using Dispositioner = Api.Database.Entities.Account.Account;

namespace Api.Database.Entities.Hospital.Patients;

public class Patient : Entity
{
    #region Admission details

    public int BeaconId { get; set; }
    public DateTime Admitted { get; set; }
    public Admitter? Admitter { get; set; }
    public string FoundAt { get; set; }
    public InitialLocation InitialLocation { get; set; }
    public SuspectedSpecies SuspectedSpecies { get; set; }
    public List<AdmissionReason> AdmissionReasons { get; set; }
    public bool IsRescue { get; set; }

    #endregion

    #region Identity

    public string Reference { get; set; }
    public string? Name { get; set; }
    public string? UniqueIdentifier { get; set; }
    public Species? Species { get; set; }
    public SpeciesVariant? SpeciesVariant { get; set; }
    public Sex? Sex { get; set; }
    public DateTime? LastUpdatedDetails { get; set; }
    [NotMapped]
    public bool IsLongTerm => Admitted <= DateTime.UtcNow.AddDays(-(SpeciesVariant?.LongTermDays ?? 28));
    [NotMapped]
    public bool IsOutdated => LastUpdatedDetails != null && LastUpdatedDetails <= DateTime.UtcNow.AddDays(-7);

    #endregion

    #region Ongoing care

    public PatientStatus Status { get; set; }
    public Pen? Pen { get; set; }
    [NotMapped]
    public Area? Area => Pen?.Area;

    public List<Exam> Exams { get; set; }
    public List<PatientRecheck> Rechecks { get; set; }
    public List<PatientPrescriptionMedication> PrescriptionMedications { get; set; }
    public List<PatientPrescriptionInstruction> PrescriptionInstructions { get; set; }
    public List<PatientNote> Notes { get; set; }
    public List<PatientMovement> Movements { get; set; }
    public List<Tag> Tags { get; set; }
    public List<Diet> Diets { get; set; }
    public List<HomeCareRequest> HomeCareRequests { get; set; }
    public List<HomeCareMessage> HomeCareMessages { get; set; }
    public List<PatientFaecalTest> FaecalTests { get; set; }
    public List<PatientBloodTest> BloodTests { get; set; }

    #endregion

    #region Outcome

    public Disposition? Disposition { get; set; }
    public DateTime? Dispositioned { get; set; }
    public List<DispositionReason> DispositionReasons { get; set; }
    public ReleaseType? ReleaseType { get; set; }
    public TransferLocation? TransferLocation { get; set; }
    public Dispositioner? Dispositioner { get; set; }

    #endregion

    public string Salt { get; set; }

    #region Helpers

    public Weight? LatestWeight
    {
        get
        {
            var exams = (Exams ?? []).Where(x => x.WeightValue.HasValue)
                .Select(x => new Weight { Date = x.Date, WeightValue = x.WeightValue, WeightUnit = x.WeightUnit });
            var notes = (Notes ?? []).Where(x => x.WeightValue.HasValue)
                .Select(x => new Weight { Date = x.Noted, WeightValue = x.WeightValue, WeightUnit = x.WeightUnit });
            var rechecks = (Rechecks ?? []).Where(x => x.Rechecked.HasValue && x.WeightValue.HasValue)
                .Select(x => new Weight { Date = x.Rechecked!.Value, WeightValue = x.WeightValue, WeightUnit = x.WeightUnit });
            var weights = new List<Weight>();
            weights.AddRange(exams);
            weights.AddRange(notes);
            weights.AddRange(rechecks);
            return weights.OrderByDescending(x => x.Date).FirstOrDefault();
        }
    }

    public class Weight
    {
        public DateTime Date { get; set; }
        public decimal? WeightValue { get; set; }
        public WeightUnit? WeightUnit { get; set; }
    }

    #endregion
}


public enum PatientStatus
{
    PendingInitialExam = 1,
    Inpatient = 2,
    PendingHomeCare = 3,
    ReceivingHomeCare = 4,
    ReadyForRelease = 5,
    Dispositioned = 6
}