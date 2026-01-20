using Api.Database;
using Api.Database.Entities.Hospital.Patients.Prescriptions;
using Api.Database.Entities.Hospital.Patients;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Api.Handlers.Hospital.Patients;
using Api.Database.Entities.Hospital.Locations;

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

        var allPatients = rechecks
            .Select(x => x.Patient)
            .Concat(prescriptions.Item1.Select(x => x.Patient))
            .Concat(prescriptions.Item2.Select(x => x.Patient))
            .DistinctBy(x => x.Id)
            .ToList();

        List<DailyTasksReportAreaPenPatient> GetPatientsInPen(Pen pen)
        {
            var patientsInPen = allPatients
                .Where(p => p.Pen?.Id == pen.Id)
                .OrderBy(p => p.Reference);

            return patientsInPen.Select(patient =>
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

                return new DailyTasksReportAreaPenPatient(
                    patient,
                    patientRechecks,
                    patientInstructions,
                    patientMedications
                );
            })
            .ToList();
        }

        var areas = await _repository.GetAll<Area>(x => true, tracking: false, x => x.Include(y => y.Pens));

        return Results.Ok(new DailyTasksReport
        {
            Areas = areas.OrderBy(x => x.Name).Select(area => new DailyTasksReportArea(area)
            {
                Pens = area.Pens.OrderBy(x => x.Code).Select(pen => new DailyTasksReportAreaPen(pen)
                {
                    Patients = GetPatientsInPen(pen)
                }).Where(x => (x.Rechecks + x.Prescriptions) > 0).ToList()
            }).Where(x => (x.Rechecks + x.Prescriptions) > 0).ToList()
        });
    }

    public class DailyTasksReport
    {
        public int Rechecks => Areas.Sum(x => x.Rechecks);
        public int Prescriptions => Areas.Sum(x => x.Prescriptions);

        public List<DailyTasksReportArea> Areas { get; set; }
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
    }

    public class DailyTasksReportAreaPenPatient(
        Patient patient,
        IReadOnlyList<PatientRecheck> rechecks,
        IReadOnlyList<PatientPrescriptionInstruction> prescriptionInstructions, IReadOnlyList<PatientPrescriptionMedication> prescriptionMedications)
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
    }

    private async Task<IReadOnlyList<PatientRecheck>> GetRechecks(DateOnly date)
    {
        var overdue = await _repository.GetAll<PatientRecheck>(x =>
            (x.Patient.Status == PatientStatus.Inpatient || x.Patient.Status == PatientStatus.PendingHomeCare) &&
                x.Due < date && x.Rechecked == null, tracking: false, Action);
        var due = await _repository.GetAll<PatientRecheck>(x =>
            (x.Patient.Status == PatientStatus.Inpatient || x.Patient.Status == PatientStatus.PendingHomeCare) &&
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
            (x.Patient.Status == PatientStatus.Inpatient || x.Patient.Status == PatientStatus.PendingHomeCare) &&
                x.Start <= date && date <= x.End, tracking: false, Action);
        var medications = await _repository.GetAll<PatientPrescriptionMedication>(x =>
            (x.Patient.Status == PatientStatus.Inpatient || x.Patient.Status == PatientStatus.PendingHomeCare) &&
                x.Start <= date && date <= x.End, tracking: false, Action);

        foreach (var medication in medications)
            if (medication.Administrations?.Any() ?? false)
                foreach (var administration in medication.Administrations)
                    administration.Administrator?.CleanUser(_encryptionService);

        foreach (var instruction in instructions)
            if (instruction.Administrations?.Any() ?? false)
                foreach (var administration in instruction.Administrations)
                    administration.Administrator?.CleanUser(_encryptionService);

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
