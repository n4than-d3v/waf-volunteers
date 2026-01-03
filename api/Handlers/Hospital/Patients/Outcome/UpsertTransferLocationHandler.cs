using Api.Database;
using Api.Database.Entities.Hospital.Patients.Outcome;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Outcome;

public class UpsertTransferLocation : IRequest<IResult>
{
    public int? Id { get; set; }
    public string Description { get; set; }
}

public class UpsertTransferLocationHandler : IRequestHandler<UpsertTransferLocation, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpsertTransferLocationHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpsertTransferLocation request, CancellationToken cancellationToken)
    {
        TransferLocation transferLocation;
        if (request.Id != null)
        {
            transferLocation = await _repository.Get<TransferLocation>(request.Id.Value);
            if (transferLocation == null) return Results.BadRequest();

            transferLocation.Description = request.Description;
        }
        else
        {
            transferLocation = new TransferLocation
            {
                Description = request.Description
            };
            _repository.Create(transferLocation);
        }

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
