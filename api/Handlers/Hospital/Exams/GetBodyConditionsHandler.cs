using Api.Database;
using Api.Database.Entities.Hospital.Patients.Exams;
using MediatR;

namespace Api.Handlers.Hospital.Exams;

public class GetBodyConditions : IRequest<IResult>
{
}

public class GetBodyConditionsHandler : IRequestHandler<GetBodyConditions, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetBodyConditionsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetBodyConditions request, CancellationToken cancellationToken)
    {
        var bodyConditions = await _repository.GetAll<BodyCondition>(x => true, tracking: false);
        return Results.Ok(bodyConditions);
    }
}
