using Api.Database;
using Api.Database.Entities.Hospital.Patients.Outcome;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Outcome;

public class GetTransferLocations : IRequest<IResult>
{
}

public class GetTransferLocationsHandler : IRequestHandler<GetTransferLocations, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetTransferLocationsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetTransferLocations request, CancellationToken cancellationToken)
    {
        var transferLocations = await _repository.GetAll<TransferLocation>(x => true, tracking: false);
        return Results.Ok(transferLocations);
    }
}
