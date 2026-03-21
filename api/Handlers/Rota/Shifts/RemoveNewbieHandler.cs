using Api.Database;
using Api.Database.Entities.Rota;
using MediatR;

namespace Api.Handlers.Rota.Shifts;

public class RemoveNewbie : IRequest<IResult>
{
    public int Id { get; set; }
}

public class RemoveNewbieHandler : IRequestHandler<RemoveNewbie, IResult>
{
    private readonly IDatabaseRepository _repository;

    public RemoveNewbieHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(RemoveNewbie request, CancellationToken cancellationToken)
    {
        var newbie = await _repository.Get<Newbie>(request.Id);
        if (newbie == null) return Results.BadRequest();

        _repository.Delete(newbie);
        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
