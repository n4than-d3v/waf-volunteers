using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Locations;
using Api.Database.Entities.Hospital.Patients;
using Api.Handlers.Hospital.Patients;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Tasks;

public class ViewRechecks : IRequest<IResult>
{
    public DateOnly Date { get; set; }
}

public class ViewRechecksHandler : IRequestHandler<ViewRechecks, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;

    public ViewRechecksHandler(IDatabaseRepository repository, IEncryptionService encryptionService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(ViewRechecks request, CancellationToken cancellationToken)
    {
        var overdue = await _repository.GetAll<PatientRecheck>(x =>
            (x.Patient.Status == PatientStatus.Inpatient || x.Patient.Status == PatientStatus.PendingHomeCare) &&
                x.Due < request.Date && x.Rechecked == null, tracking: false, Action);
        var due = await _repository.GetAll<PatientRecheck>(x =>
            (x.Patient.Status == PatientStatus.Inpatient || x.Patient.Status == PatientStatus.PendingHomeCare) &&
                x.Due == request.Date, tracking: false, Action);

        var rechecks = new List<PatientRecheck>();
        rechecks.AddRange(overdue);
        rechecks.AddRange(due);

        foreach (var recheck in rechecks)
        {
            recheck.Rechecker?.CleanUser(_encryptionService);
        }

        return Results.Ok(rechecks);
    }

    static IQueryable<PatientRecheck> Action(DbSet<PatientRecheck> x)
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
}
