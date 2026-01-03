using Api.Database;
using Api.Database.Entities.Hospital.Patients.Outcome;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Outcome;

public class UpsertDispositionReason : IRequest<IResult>
{
    public int? Id { get; set; }
    public string Description { get; set; }
    public string Communication { get; set; }
}

public class UpsertDispositionReasonHandler : IRequestHandler<UpsertDispositionReason, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpsertDispositionReasonHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpsertDispositionReason request, CancellationToken cancellationToken)
    {
        DispositionReason dispositionReason;
        if (request.Id != null)
        {
            dispositionReason = await _repository.Get<DispositionReason>(request.Id.Value);
            if (dispositionReason == null) return Results.BadRequest();

            dispositionReason.Description = request.Description;
            dispositionReason.Communication = request.Communication;
        }
        else
        {
            dispositionReason = new DispositionReason
            {
                Description = request.Description,
                Communication = request.Communication
            };
            _repository.Create(dispositionReason);
        }

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
