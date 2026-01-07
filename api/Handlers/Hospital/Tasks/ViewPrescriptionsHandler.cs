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
        var instructions = await _repository.GetAll<PatientPrescriptionInstruction>(x =>
            (x.Patient.Status == PatientStatus.Inpatient || x.Patient.Status == PatientStatus.PendingHomeCare) &&
                x.Start <= request.Date && request.Date <= x.End, tracking: false, Action);
        var medications = await _repository.GetAll<PatientPrescriptionMedication>(x =>
            (x.Patient.Status == PatientStatus.Inpatient || x.Patient.Status == PatientStatus.PendingHomeCare) &&
                x.Start <= request.Date && request.Date <= x.End, tracking: false, Action);
        return Results.Ok(new { instructions, medications });
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
