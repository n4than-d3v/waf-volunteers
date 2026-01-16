using Api.Database;
using Api.Database.Entities.Hospital.Patients.Medications;
using Api.Database.Entities.Stock;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Stock;

public class GetStockItems : IRequest<IResult>
{
}

public class GetStockItemsHandler : IRequestHandler<GetStockItems, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetStockItemsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetStockItems request, CancellationToken cancellationToken)
    {
        var items = await _repository.GetAll<StockItem>(x => true, tracking: false,
            action: x => x.Include(y => y.Medication).Include(y => y.MedicationConcentration));
        return Results.Ok(items);
    }
}
