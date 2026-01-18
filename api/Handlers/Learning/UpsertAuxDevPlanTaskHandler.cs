using Api.Database;
using Api.Database.Entities.Learning;
using MediatR;

namespace Api.Handlers.Learning;

public class UpsertAuxDevPlanTask : IRequest<IResult>
{
    public int? Id { get; set; }
    public string Name { get; set; }
    public string Explanation { get; set; }
    public string[] YouTube { get; set; }
}

public class UpsertAuxDevPlanTaskHandler : IRequestHandler<UpsertAuxDevPlanTask, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpsertAuxDevPlanTaskHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpsertAuxDevPlanTask request, CancellationToken cancellationToken)
    {
        if (request.Id.HasValue)
        {
            var existing = await _repository.Get<AuxDevPlanTask>(request.Id.Value);
            if (existing == null) return Results.BadRequest();

            existing.Name = request.Name;
            existing.Explanation = request.Explanation;
            existing.YouTube = request.YouTube;
        }
        else
        {
            var task = new AuxDevPlanTask
            {
                Name = request.Name,
                Explanation = request.Explanation,
                YouTube = request.YouTube
            };

            _repository.Create(task);
        }

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
