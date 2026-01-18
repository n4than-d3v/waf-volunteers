using Api.Database;
using Api.Database.Entities.Hospital.Patients.Outcome;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Outcome;

public class GetDispositionReasons : IRequest<IResult>
{
}

public class GetDispositionReasonsHandler : IRequestHandler<GetDispositionReasons, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetDispositionReasonsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetDispositionReasons request, CancellationToken cancellationToken)
    {
        var dispositionReasons = await _repository.GetAll<DispositionReason>(x => true, tracking: false);
        return Results.Ok(dispositionReasons.OrderBy(x => x.Description));
    }
}
