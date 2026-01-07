using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Rechecks;

public class RemoveRecheck : IRequest<IResult>
{
    public int PatientRecheckId { get; set; }
}

public class RemoveRecheckHandler : IRequestHandler<RemoveRecheck, IResult>
{
    private readonly IDatabaseRepository _repository;

    public RemoveRecheckHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(RemoveRecheck request, CancellationToken cancellationToken)
    {
        var recheck = await _repository.Get<PatientRecheck>(request.PatientRecheckId);
        if (recheck == null) return Results.BadRequest();

        _repository.Delete(recheck);
        await _repository.SaveChangesAsync();
        return Results.Created();
    }
}
