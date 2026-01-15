using Api.Database;
using Api.Database.Entities.Rota;
using MediatR;

namespace Api.Handlers.Rota.Shifts;

public class VisitorClockIn : IRequest<IResult>
{
    public string Name { get; set; }
    public string? Car { get; set; }
}

public class VisitorClockInHandler : IRequestHandler<VisitorClockIn, IResult>
{
    private readonly IDatabaseRepository _repository;

    public VisitorClockInHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(VisitorClockIn request, CancellationToken cancellationToken)
    {
        _repository.Create(new VisitorClocking
        {
            Name = request.Name,
            Date = DateOnly.FromDateTime(DateTime.Now),
            Car = request.Car,
            In = TimeOnly.FromDateTime(DateTime.Now)
        });

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
