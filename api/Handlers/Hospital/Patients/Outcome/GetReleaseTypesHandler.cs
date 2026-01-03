using Api.Database;
using Api.Database.Entities.Hospital.Patients.Outcome;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Outcome;

public class GetReleaseTypes : IRequest<IResult>
{
}

public class GetReleaseTypesHandler : IRequestHandler<GetReleaseTypes, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetReleaseTypesHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetReleaseTypes request, CancellationToken cancellationToken)
    {
        var releaseTypes = await _repository.GetAll<ReleaseType>(x => true, tracking: false);
        return Results.Ok(releaseTypes);
    }
}
