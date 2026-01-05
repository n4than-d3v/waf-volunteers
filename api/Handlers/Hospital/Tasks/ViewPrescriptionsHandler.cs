using Api.Database;
using Api.Database.Entities.Hospital.Locations;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Medications;
using Api.Database.Entities.Hospital.Patients.Prescriptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Tasks;

public class ViewPrescriptions : IRequest<IResult>
{
    public DateOnly Date { get; set; }
}

public class ViewPrescriptionsHandler : IRequestHandler<ViewPrescriptions, IResult>
{
    private readonly IDatabaseRepository _repository;

    public ViewPrescriptionsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(ViewPrescriptions request, CancellationToken cancellationToken)
    {
        var instructions = await _repository.GetAll<PatientPrescriptionInstruction>(x => x.Start <= request.Date && request.Date <= x.End, tracking: false, Action);
        var medications = await _repository.GetAll<PatientPrescriptionMedication>(x => x.Start <= request.Date && request.Date <= x.End, tracking: false, Action);
        return Results.Ok(new
        {
            instructions = instructions.Select(x => new InstructionDto(x)).ToList(),
            medications = medications.Select(x => new MedicationDto(x)).ToList()
        });
    }

    public class InstructionDto(PatientPrescriptionInstruction instruction)
    {
        public Species Species { get; set; } = instruction.Patient.Species;
        public SpeciesVariant SpeciesVariant { get; set; } = instruction.Patient.SpeciesVariant;
        public Pen Pen { get; set; } = instruction.Patient.Pen;
        public DateOnly Start { get; set; } = instruction.Start;
        public DateOnly End { get; set; } = instruction.End;
        public string Instructions { get; set; } = instruction.Instructions;
        public string Frequency { get; set; } = instruction.Frequency;
        public List<PatientPrescriptionInstructionAdministration> Administrations { get; set; } = instruction.Administrations;
    }

    public class MedicationDto(PatientPrescriptionMedication medication)
    {
        public Species Species { get; set; } = medication.Patient.Species;
        public SpeciesVariant SpeciesVariant { get; set; } = medication.Patient.SpeciesVariant;
        public Pen Pen { get; set; } = medication.Patient.Pen;
        public DateOnly Start { get; set; } = medication.Start;
        public DateOnly End { get; set; } = medication.End;
        public decimal QuantityValue { get; set; } = medication.QuantityValue;
        public string QuantityUnit { get; set; } = medication.QuantityUnit;
        public Medication Medication { get; set; } = medication.Medication;
        public AdministrationMethod AdministrationMethod { get; set; } = medication.AdministrationMethod;
        public string Comments { get; set; } = medication.Comments;
        public string Frequency { get; set; } = medication.Frequency;
        public List<PatientPrescriptionMedicationAdministration> Administrations { get; set; } = medication.Administrations;
    }

    static IQueryable<PatientPrescriptionInstruction> Action(DbSet<PatientPrescriptionInstruction> x)
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

    static IQueryable<PatientPrescriptionMedication> Action(DbSet<PatientPrescriptionMedication> x)
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
            .Include(y => y.AdministrationMethod)
            .Include(y => y.Administrations)
                .ThenInclude(y => y.Administrator);
    }
}
