using Api.Database;
using Api.Database.Entities.Hospital.Patients.Exams;
using MediatR;

namespace Api.Handlers.Hospital.Exams;

public class GetDehydrations : IRequest<IResult>
{
}

public class GetDehydrationsHandler : IRequestHandler<GetDehydrations, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetDehydrationsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetDehydrations request, CancellationToken cancellationToken)
    {
        var dehydrations = await _repository.GetAll<Dehydration>(x => true, tracking: false);
        return Results.Ok(dehydrations);
    }
}
