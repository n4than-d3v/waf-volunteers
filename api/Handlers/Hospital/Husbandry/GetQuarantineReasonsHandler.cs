using Api.Database;
using Api.Database.Entities.Hospital.Patients.Husbandry;
using MediatR;

namespace Api.Handlers.Hospital.Husbandry;

public class GetQuarantineReasons : IRequest<IResult>
{
}

public class GetQuarantineReasonsHandler : IRequestHandler<GetQuarantineReasons, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetQuarantineReasonsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetQuarantineReasons request, CancellationToken cancellationToken)
    {
        var quarantineReasons = await _repository.GetAll<QuarantineReason>(x => true, tracking: false);
        return Results.Ok(quarantineReasons.OrderBy(x => x.Order));
    }
}
