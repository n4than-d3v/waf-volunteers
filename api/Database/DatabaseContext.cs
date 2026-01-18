using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Locations;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Admission;
using Api.Database.Entities.Hospital.Patients.Exams;
using Api.Database.Entities.Hospital.Patients.HomeCare;
using Api.Database.Entities.Hospital.Patients.Husbandry;
using Api.Database.Entities.Hospital.Patients.Labs;
using Api.Database.Entities.Hospital.Patients.Medications;
using Api.Database.Entities.Hospital.Patients.Outcome;
using Api.Database.Entities.Hospital.Patients.Prescriptions;
using Api.Database.Entities.Learning;
using Api.Database.Entities.Notices;
using Api.Database.Entities.Rota;
using Api.Database.Entities.Stock;
using Microsoft.EntityFrameworkCore;

namespace Api.Database;

public class DatabaseContext : DbContext
{
    // Account management
    public DbSet<Account> Accounts { get; set; }
    public DbSet<ResetPasswordRequest> ResetPasswordRequests { get; set; }

    // Rota management
    public DbSet<Attendance> Attendance { get; set; }
    public DbSet<AttendanceClocking> AttendanceClockings { get; set; }
    public DbSet<VisitorClocking> VisitorClockings { get; set; }
    public DbSet<TimeRange> TimeRanges { get; set; }
    public DbSet<Job> Jobs { get; set; }
    public DbSet<MissingReason> MissingReasons { get; set; }
    public DbSet<RegularShift> RegularShifts { get; set; }
    public DbSet<Requirement> Requirements { get; set; }

    // Assignments on shift
    public DbSet<AssignableArea> AssignableAreas { get; set; }
    public DbSet<AssignableShift> AssignableShifts { get; set; }
    public DbSet<Assignment> Assignments { get; set; }
    public DbSet<Newbie> Newbies { get; set; }
    public DbSet<WorkExperience> WorkExperiences { get; set; }
    public DbSet<WorkExperienceDate> WorkExperienceDates { get; set; }

    // Notices
    public DbSet<Notice> Notices { get; set; }
    public DbSet<NoticeAttachment> NoticeAttachments { get; set; }
    public DbSet<NoticeInteraction> NoticeInteractions { get; set; }

    // Hospital
    public DbSet<Area> Areas { get; set; }
    public DbSet<Pen> Pens { get; set; }
    public DbSet<AdmissionReason> AdmissionReasons { get; set; }
    public DbSet<Admitter> Admitters { get; set; }
    public DbSet<InitialLocation> InitialLocations { get; set; }
    public DbSet<SuspectedSpecies> SuspectedSpecies { get; set; }
    public DbSet<Attitude> Attitudes { get; set; }
    public DbSet<BodyCondition> BodyConditions { get; set; }
    public DbSet<Dehydration> Dehydrations { get; set; }
    public DbSet<Exam> Exams { get; set; }
    public DbSet<ExamTreatmentInstruction> ExamTreatmentInstructions { get; set; }
    public DbSet<ExamTreatmentMedication> ExamTreatmentMedications { get; set; }
    public DbSet<MucousMembraneColour> MucousMembraneColours { get; set; }
    public DbSet<MucousMembraneTexture> MucousMembraneTextures { get; set; }
    public DbSet<HomeCareMessage> HomeCareMessages { get; set; }
    public DbSet<HomeCareRequest> HomeCareRequests { get; set; }
    public DbSet<Diet> Diets { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<AdministrationMethod> AdministrationMethods { get; set; }
    public DbSet<Medication> Medications { get; set; }
    public DbSet<MedicationConcentration> MedicationConcentrations { get; set; }
    public DbSet<MedicationConcentrationSpeciesDose> MedicationConcentrationSpeciesDoses { get; set; }
    public DbSet<DispositionReason> DispositionReasons { get; set; }
    public DbSet<ReleaseType> ReleaseTypes { get; set; }
    public DbSet<TransferLocation> TransferLocations { get; set; }
    public DbSet<Patient> Patients { get; set; }
    public DbSet<PatientMovement> PatientMovements { get; set; }
    public DbSet<PatientNote> PatientNotes { get; set; }
    public DbSet<PatientNoteAttachment> PatientNoteAttachments { get; set; }
    public DbSet<PatientPrescriptionInstruction> PatientPrescriptionInstructions { get; set; }
    public DbSet<PatientPrescriptionInstructionAdministration> PatientPrescriptionInstructionAdministrations { get; set; }
    public DbSet<PatientPrescriptionMedication> PatientPrescriptionMedications { get; set; }
    public DbSet<PatientPrescriptionMedicationAdministration> PatientPrescriptionMedicationAdministrations { get; set; }
    public DbSet<PatientRecheck> PatientRechecks { get; set; }
    public DbSet<PatientBloodTest> PatientBloodTests { get; set; }
    public DbSet<PatientBloodTestAttachment> PatientBloodTestAttachments { get; set; }
    public DbSet<PatientFaecalTest> PatientFaecalTests { get; set; }
    public DbSet<Species> Species { get; set; }
    public DbSet<SpeciesVariant> SpeciesVariants { get; set; }

    // Stock
    public DbSet<StockItem> StockItems { get; set; }
    public DbSet<StockItemBatch> StockItemBatches { get; set; }
    public DbSet<StockItemBatchUsage> StockItemBatchUsages { get; set; }

    // Learning
    public DbSet<AuxDevPlanTask> AuxDevPlanTasks { get; set; }
    public DbSet<AuxDevPlanTaskWitness> AuxDevPlanTaskWitnesses { get; set; }

    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }
}
