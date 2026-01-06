using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Locations;
using Api.Database.Entities.Hospital.Patients;
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

    public ViewRechecksHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(ViewRechecks request, CancellationToken cancellationToken)
    {
        var overdue = await _repository.GetAll<PatientRecheck>(x => x.Due < request.Date && x.Rechecked == null, tracking: false, Action);
        var due = await _repository.GetAll<PatientRecheck>(x => x.Due == request.Date, tracking: false, Action);
        return Results.Ok(new
        {
            overdue = overdue.Select(x => new RecheckDto(x)).ToList(),
            due = due.Select(x => new RecheckDto(x)).ToList()
        });
    }

    public class RecheckDto(PatientRecheck recheck)
    {
        public Species Species { get; set; } = recheck.Patient.Species;
        public SpeciesVariant SpeciesVariant { get; set; } = recheck.Patient.SpeciesVariant;
        public Pen Pen { get; set; } = recheck.Patient.Pen;
        public DateOnly Due { get; set; } = recheck.Due;
        public string Description { get; set; } = recheck.Description;
        public RecheckRoles Roles { get; set; } = recheck.Roles;
        public Account? Rechecker { get; set; } = recheck.Rechecker;
        public DateTime? Rechecked { get; set; } = recheck.Rechecked;
        public string? Comments { get; set; } = recheck.Comments;
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
