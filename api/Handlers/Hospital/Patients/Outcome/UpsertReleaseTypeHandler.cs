using Api.Database;
using Api.Database.Entities.Hospital.Patients.Outcome;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Outcome;

public class UpsertReleaseType : IRequest<IResult>
{
    public int? Id { get; set; }
    public string Description { get; set; }
    public bool Deleted { get; set; }
}

public class UpsertReleaseTypeHandler : IRequestHandler<UpsertReleaseType, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpsertReleaseTypeHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpsertReleaseType request, CancellationToken cancellationToken)
    {
        ReleaseType releaseType;
        if (request.Id != null)
        {
            releaseType = await _repository.Get<ReleaseType>(request.Id.Value);
            if (releaseType == null) return Results.BadRequest();

            releaseType.Description = request.Description;
            releaseType.Deleted = request.Deleted;
        }
        else
        {
            releaseType = new ReleaseType
            {
                Description = request.Description
            };
            _repository.Create(releaseType);
        }

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
