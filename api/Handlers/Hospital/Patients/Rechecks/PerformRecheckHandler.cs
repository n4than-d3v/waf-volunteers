using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Exams;
using Api.Handlers.Hospital.Patients.Notes;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Patients.Rechecks;

public class PerformRecheck : IRequest<IResult>
{
    public int RecheckId { get; set; }
    public string Comments { get; set; }
    public int? WeightValue { get; set; }
    public WeightUnit? WeightUnit { get; set; }

    public PerformRecheck WithId(int id)
    {
        RecheckId = id;
        return this;
    }
}

public class PerformRecheckHandler : IRequestHandler<PerformRecheck, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;
    private readonly IMediator _mediator;

    public PerformRecheckHandler(IDatabaseRepository repository, IUserContext userContext, IMediator mediator)
    {
        _repository = repository;
        _userContext = userContext;
        _mediator = mediator;
    }

    public async Task<IResult> Handle(PerformRecheck request, CancellationToken cancellationToken)
    {
        var recheck = await _repository.Get<PatientRecheck>(request.RecheckId, action: x => x.Include(y => y.Patient));
        if (recheck == null) return Results.BadRequest();

        var rechecker = await _repository.Get<Account>(_userContext.Id);
        if (rechecker == null) return Results.BadRequest();

        recheck.Rechecker = rechecker;
        recheck.Rechecked = DateTime.UtcNow;
        recheck.Patient.LastUpdatedDetails = DateTime.UtcNow;

        await _repository.SaveChangesAsync();

        if (request.WeightValue.HasValue || !string.IsNullOrWhiteSpace(request.Comments))
        {
            await _mediator.Send(new AddPatientNote
            {
                Comments = request.Comments,
                WeightValue = request.WeightValue,
                WeightUnit = request.WeightUnit
            }.WithId(recheck.Patient.Id), cancellationToken);
        }

        return Results.Created();
    }
}
