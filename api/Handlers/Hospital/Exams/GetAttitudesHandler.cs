using Api.Database;
using Api.Database.Entities.Hospital.Patients.Exams;
using MediatR;

namespace Api.Handlers.Hospital.Exams;

public class GetAttitudes : IRequest<IResult>
{
}

public class GetAttitudesHandler : IRequestHandler<GetAttitudes, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetAttitudesHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetAttitudes request, CancellationToken cancellationToken)
    {
        var attitudes = await _repository.GetAll<Attitude>(x => true, tracking: false);
        return Results.Ok(attitudes);
    }
}
