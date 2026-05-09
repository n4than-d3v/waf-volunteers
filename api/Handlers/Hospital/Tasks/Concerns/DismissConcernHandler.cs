namespace Api.Handlers.Hospital.Tasks.Concerns;

using System.Threading;
using System.Threading.Tasks;
using Api.Database;
using Api.Database.Entities.Hospital.Tasks;
using MediatR;

public class DismissConcern : IRequest<IResult>
{
    public int Id { get; set; }
}

public class DismissConcernHandler : IRequestHandler<DismissConcern, IResult>
{
    private readonly IDatabaseRepository _repository;

    public DismissConcernHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(DismissConcern request, CancellationToken cancellationToken)
    {
        var concern = await _repository.Get<HusbandryConcern>(request.Id);
        if (concern == null) return Results.NotFound();

        concern.Checked = true;
        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
