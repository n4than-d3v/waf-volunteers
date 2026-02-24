using Api.Database;
using Api.Database.Entities.Hospital.Patients.Husbandry;
using MediatR;

namespace Api.Handlers.Hospital.Husbandry;

public class GetFoods : IRequest<IResult>
{
}

public class GetFoodsHandler : IRequestHandler<GetFoods, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetFoodsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetFoods request, CancellationToken cancellationToken)
    {
        var foods = await _repository.GetAll<Food>(x => true, tracking: false);
        return Results.Ok(foods);
    }
}
