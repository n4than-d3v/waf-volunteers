using Api.Database;
using Api.Database.Entities.Hospital.Patients.Husbandry;
using MediatR;

namespace Api.Handlers.Hospital.Husbandry;

public class GetDiets : IRequest<IResult>
{
}

public class GetDietsHandler : IRequestHandler<GetDiets, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetDietsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetDiets request, CancellationToken cancellationToken)
    {
        var diets = await _repository.GetAll<Diet>(x => true, tracking: false);
        return Results.Ok(diets);
    }
}
