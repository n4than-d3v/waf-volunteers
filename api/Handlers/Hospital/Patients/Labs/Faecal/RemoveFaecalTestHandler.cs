using Api.Database;
using Api.Database.Entities.Hospital.Patients.Labs;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Labs.Faecal;

public class RemoveFaecalTest : IRequest<IResult>
{
    public int Id { get; set; }
}

public class RemoveFaecalTestHandler : IRequestHandler<RemoveFaecalTest, IResult>
{
    private readonly IDatabaseRepository _repository;

    public RemoveFaecalTestHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(RemoveFaecalTest request, CancellationToken cancellationToken)
    {
        var test = await _repository.Get<PatientFaecalTest>(request.Id);
        if (test == null) return Results.BadRequest();

        _repository.Delete(test);

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
