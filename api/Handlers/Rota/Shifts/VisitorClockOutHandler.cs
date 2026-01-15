using Api.Database;
using Api.Database.Entities.Rota;
using MediatR;

namespace Api.Handlers.Rota.Shifts;

public class VisitorClockOut : IRequest<IResult>
{
    public int Id { get; set; }
}

public class VisitorClockOutHandler : IRequestHandler<VisitorClockOut, IResult>
{
    private readonly IDatabaseRepository _repository;

    public VisitorClockOutHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(VisitorClockOut request, CancellationToken cancellationToken)
    {
        var existing = await _repository.Get<VisitorClocking>(
            x => x.Id == request.Id);

        if (existing == null) return Results.BadRequest();

        var now = TimeOnly.FromDateTime(DateTime.Now);

        existing.Out = now;

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
