using Api.Database;
using Api.Database.Entities.Hospital.Patients.Husbandry;
using MediatR;

namespace Api.Handlers.Hospital.Husbandry;

public class UpsertQuarantineReason : IRequest<IResult>
{
    public int? Id { get; set; }
    public string Name { get; set; }
    public int Order { get; set; }
}

public class UpsertQuarantineReasonHandler : IRequestHandler<UpsertQuarantineReason, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpsertQuarantineReasonHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpsertQuarantineReason request, CancellationToken cancellationToken)
    {
        QuarantineReason quarantineReason;
        if (request.Id != null)
        {
            quarantineReason = await _repository.Get<QuarantineReason>(request.Id.Value);
            if (quarantineReason == null) return Results.BadRequest();

            quarantineReason.Name = request.Name;
            quarantineReason.Order = request.Order;
        }
        else
        {
            quarantineReason = new QuarantineReason
            {
                Name = request.Name,
                Order = request.Order
            };
            _repository.Create(quarantineReason);
        }

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
