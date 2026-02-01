using Api.Database;
using Api.Database.Entities.Hospital.Patients.Labs;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Labs.Blood;

public class RemoveBloodTest : IRequest<IResult>
{
    public int Id { get; set; }
}

public class RemoveBloodTestHandler : IRequestHandler<RemoveBloodTest, IResult>
{
    private readonly IDatabaseRepository _repository;

    public RemoveBloodTestHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(RemoveBloodTest request, CancellationToken cancellationToken)
    {
        var test = await _repository.Get<PatientBloodTest>(request.Id);
        if (test == null) return Results.BadRequest();

        _repository.Delete(test);

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
