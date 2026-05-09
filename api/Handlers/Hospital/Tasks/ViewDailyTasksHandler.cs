using Api.Database;
using Api.Database.Entities.Hospital.Patients.Prescriptions;
using Api.Database.Entities.Hospital.Patients;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Api.Handlers.Hospital.Patients;
using Api.Database.Entities.Hospital.Locations;
using Api.Handlers.Stock;
using Api.Database.Entities.Hospital.Tasks;

namespace Api.Handlers.Hospital.Tasks;

public class ViewDailyTasks : IRequest<IResult>
{
    public DateOnly Date { get; set; }
}

public class ViewDailyTasksHandler : IRequestHandler<ViewDailyTasks, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;

    public ViewDailyTasksHandler(IDatabaseRepository repository, IEncryptionService encryptionService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(ViewDailyTasks request, CancellationToken cancellationToken)
    {
        var rechecks = await GetRechecks(request.Date);
        var prescriptions = await GetPrescriptions(request.Date);
        var customTasks = await _repository.GetAll<CustomDailyTask>(x => true, tracking: false);
        var concerns = await _repository.GetAll<HusbandryConcern>(x => x.Checked == false, tracking: false,
            action: x => x.Include(y => y.Pen).ThenInclude(y => y.Area).Include(y => y.Reason));
        var allPatients = await _repository.GetAll<Patient>(x =>
            x.Status == PatientStatus.Inpatient || x.Status == PatientStatus.PendingHomeCare || x.Status == PatientStatus.ReceivingHomeCare || x.Status == PatientStatus.ReadyForRelease, tracking: false,
            action: x => x.Include(y => y.Species).Include(y => y.SpeciesVariant).Include(y => y.Pen).ThenInclude(y => y.Area));

        var handler = new GetStockHandler(_repository);
        var allStock = (await handler.GetStock()).ToList();

        List<DailyTasksReportAreaPenPatient> GetPatientsInPen(Pen pen)
        {
            var patientsInPen = allPatients
                .Where(p => p.Pen?.Id == pen.Id)
                .OrderBy(p => p.Reference);

            return [.. patientsInPen.Select(patient =>
            {
                var patientRechecks = rechecks
                    .Where(x => x.Patient.Id == patient.Id)
                    .ToList();

                var patientInstructions = prescriptions.Item1
                    .Where(x => x.Patient.Id == patient.Id)
                    .ToList();

                var patientMedications = prescriptions.Item2
                    .Where(x => x.Patient.Id == patient.Id)
                    .ToList();

                var warnings = new List<DailyTasksReportAreaPenPatientWarning>();
                var stock = allStock.Where(x => patientMedications.Any(y => y.MedicationConcentration.Id == x.MedicationConcentrationId));
                var expiredItems = stock.Where(x => x.Expired || x.ExpiredAfterOpening);
                if (expiredItems.Any())
                {
                    foreach (var item in expiredItems)
                        foreach (var batch in item.Batches.Where(x => x.Expired || x.ExpiredAfterOpening))
                            warnings.Add(
                                new DailyTasksReportAreaPenPatientWarning(
                                    batch.Number, item.Brand,
                                    batch.Expired, batch.ExpiredAfterOpening)
                            );
                }

                return new DailyTasksReportAreaPenPatient(
                    patient,
                    patientRechecks,
                    patientInstructions,
                    patientMedications,
                    warnings
                );
            })];
        }

        var areas = await _repository.GetAll<Area>(x => true, tracking: false, x => x.Include(y => y.Pens));

        var report = new DailyTasksReport
        {
            CustomTasks = [.. customTasks.GroupBy(x => x.Location).Select(location => new DailyTasksReportCustomTaskLocation
            {
                Location = location.Key,
                Tasks = [.. location.Select(task => new DailyTaskReportCustomTask
                {
                    Id = task.Id,
                    Task = task.Message,
                    LastDone = task.LastDone,
                    Done = task.LastDone?.Date == DateTime.UtcNow.Date
                })]
            })],
            Areas = [.. areas.OrderBy(x => x.Name).Select(area => new DailyTasksReportArea(area)
            {
                Pens = [.. area.Pens.OrderBy(x => x.Code).Select(pen => new DailyTasksReportAreaPen(pen)
                {
                    Patients = GetPatientsInPen(pen),
                    Concerns = [.. concerns.Where(x => x.Pen.Id == pen.Id)]
                }).Where(x => x.Concerns.Any() || (x.Rechecks + x.Prescriptions) > 0)]
            }).Where(x => x.Pens.Any())]
        };

        return Results.Ok(report);
    }

    public class DailyTasksReport
    {
        public int Rechecks => Areas.Sum(x => x.Rechecks);
        public int Prescriptions => Areas.Sum(x => x.Prescriptions);

        public List<DailyTasksReportArea> Areas { get; set; }
        public List<DailyTasksReportCustomTaskLocation> CustomTasks { get; set; }
    }

    public class DailyTasksReportCustomTaskLocation
    {
        public string Location { get; set; }
        public List<DailyTaskReportCustomTask> Tasks { get; set; }
    }

    public class DailyTaskReportCustomTask
    {
        public int Id { get; set; }
        public string Task { get; set; }
        public DateTime? LastDone { get; set; }
        public bool Done { get; set; }
    }

    public class DailyTasksReportArea(Area area)
    {
        private readonly Area _area = area;

        public string Name => _area.Name;
        public string Code => _area.Code;

        public int Rechecks => Pens.Sum(x => x.Rechecks);
        public int Prescriptions => Pens.Sum(x => x.Prescriptions);

        public List<DailyTasksReportAreaPen> Pens { get; set; }
    }

    public class DailyTasksReportAreaPen(Pen pen)
    {
        private readonly Pen _pen = pen;

        public string Code => _pen.Code;
        public string Reference => _pen.Reference;

        public int Rechecks => Patients.Sum(x => x.Rechecks.Count);
        public int Prescriptions => Patients.Sum(x => x.PrescriptionInstructions.Count + x.PrescriptionMedications.Count);

        public List<DailyTasksReportAreaPenPatient> Patients { get; set; }
        public List<HusbandryConcern> Concerns { get; set; }
    }

    public record DailyTasksReportAreaPenPatientWarning(string BatchNumber, string Brand, bool Expiry, bool ExpiryInUse);

    public class DailyTasksReportAreaPenPatient(
        Patient patient,
        IReadOnlyList<PatientRecheck> rechecks,
        IReadOnlyList<PatientPrescriptionInstruction> prescriptionInstructions,
        IReadOnlyList<PatientPrescriptionMedication> prescriptionMedications,
        IReadOnlyList<DailyTasksReportAreaPenPatientWarning> warnings)
    {
        private readonly Patient _patient = patient;

        public int Id => _patient.Id;
        public string Reference => _patient.Reference;
        public string UniqueIdentifier => _patient.UniqueIdentifier;
        public Species Species => _patient.Species;
        public SpeciesVariant Variant => _patient.SpeciesVariant;

        public IReadOnlyList<PatientRecheck> Rechecks { get; set; } = rechecks;
        public IReadOnlyList<PatientPrescriptionInstruction> PrescriptionInstructions { get; set; } = prescriptionInstructions;
        public IReadOnlyList<PatientPrescriptionMedication> PrescriptionMedications { get; set; } = prescriptionMedications;
        public IReadOnlyList<DailyTasksReportAreaPenPatientWarning> Warnings { get; set; } = warnings;
    }

    private async Task<IReadOnlyList<PatientRecheck>> GetRechecks(DateOnly date)
    {
        var overdue = await _repository.GetAll<PatientRecheck>(x =>
            (x.Patient.Status == PatientStatus.Inpatient || x.Patient.Status == PatientStatus.PendingHomeCare || x.Patient.Status == PatientStatus.ReceivingHomeCare || x.Patient.Status == PatientStatus.ReadyForRelease) &&
                x.Due < date && x.Rechecked == null, tracking: false, Action);
        var due = await _repository.GetAll<PatientRecheck>(x =>
            (x.Patient.Status == PatientStatus.Inpatient || x.Patient.Status == PatientStatus.PendingHomeCare || x.Patient.Status == PatientStatus.ReceivingHomeCare || x.Patient.Status == PatientStatus.ReadyForRelease) &&
                x.Due == date, tracking: false, Action);

        var rechecks = new List<PatientRecheck>();
        rechecks.AddRange(overdue);
        rechecks.AddRange(due);

        foreach (var recheck in rechecks)
            recheck.Rechecker?.CleanUser(_encryptionService);

        return rechecks;
    }

    private async Task<(IReadOnlyList<PatientPrescriptionInstruction>, IReadOnlyList<PatientPrescriptionMedication>)> GetPrescriptions(DateOnly date)
    {
        var instructions = await _repository.GetAll<PatientPrescriptionInstruction>(x =>
            (x.Patient.Status == PatientStatus.Inpatient || x.Patient.Status == PatientStatus.PendingHomeCare || x.Patient.Status == PatientStatus.ReceivingHomeCare || x.Patient.Status == PatientStatus.ReadyForRelease) &&
                x.Start <= date && date <= x.End, tracking: false, Action);
        var medications = await _repository.GetAll<PatientPrescriptionMedication>(x =>
            (x.Patient.Status == PatientStatus.Inpatient || x.Patient.Status == PatientStatus.PendingHomeCare || x.Patient.Status == PatientStatus.ReceivingHomeCare || x.Patient.Status == PatientStatus.ReadyForRelease) &&
                x.Start <= date && date <= x.End, tracking: false, Action);

        foreach (var medication in medications)
        {
            medication.SetToday(date);
            if (medication.Administrations?.Any() ?? false)
                foreach (var administration in medication.Administrations)
                    administration.Administrator?.CleanUser(_encryptionService);
        }

        foreach (var instruction in instructions)
        {
            instruction.SetToday(date);
            if (instruction.Administrations?.Any() ?? false)
                foreach (var administration in instruction.Administrations)
                    administration.Administrator?.CleanUser(_encryptionService);
        }

        return (instructions, medications);
    }

    private static IQueryable<PatientRecheck> Action(DbSet<PatientRecheck> x)
    {
        return x
            .Include(y => y.Patient)
                .ThenInclude(y => y.Species)
            .Include(y => y.Patient)
                .ThenInclude(y => y.SpeciesVariant)
            .Include(y => y.Patient)
                .ThenInclude(y => y.Pen)
                    .ThenInclude(y => y.Area)
            .Include(y => y.Rechecker);
    }

    private static IQueryable<PatientPrescriptionInstruction> Action(DbSet<PatientPrescriptionInstruction> x)
    {
        return x
            .Include(y => y.Patient)
                .ThenInclude(y => y.Species)
            .Include(y => y.Patient)
                .ThenInclude(y => y.SpeciesVariant)
            .Include(y => y.Patient)
                .ThenInclude(y => y.Pen)
                    .ThenInclude(y => y.Area)
            .Include(y => y.Administrations)
                .ThenInclude(y => y.Administrator);
    }

    private static IQueryable<PatientPrescriptionMedication> Action(DbSet<PatientPrescriptionMedication> x)
    {
        return x
            .Include(y => y.Patient)
                .ThenInclude(y => y.Species)
            .Include(y => y.Patient)
                .ThenInclude(y => y.SpeciesVariant)
            .Include(y => y.Patient)
                .ThenInclude(y => y.Pen)
                    .ThenInclude(y => y.Area)
            .Include(y => y.Medication)
            .Include(y => y.MedicationConcentration)
            .Include(y => y.AdministrationMethod)
            .Include(y => y.Administrations)
                .ThenInclude(y => y.Administrator);
    }
}
