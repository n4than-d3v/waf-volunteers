using Api.Database;
using Api.Database.Entities.Hospital.Patients.Medications;
using Api.Database.Entities.Stock;
using MediatR;

namespace Api.Handlers.Stock;

public class AddStockItem : IRequest<IResult>
{
    public int MedicationId { get; set; }
    public int MedicationConcentrationId { get; set; }
    public string Brand { get; set; }
    public StockMeasurement Measurement { get; set; }
    public int AfterOpeningLifetimeDays { get; set; }
    public int ReorderQuantity { get; set; }
}

public class AddStockItemHandler : IRequestHandler<AddStockItem, IResult>
{
    private readonly IDatabaseRepository _repository;

    public AddStockItemHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(AddStockItem request, CancellationToken cancellationToken)
    {
        var medication = await _repository.Get<Medication>(request.MedicationId);
        if (medication == null) return Results.BadRequest();

        var medicationConcentration = await _repository.Get<MedicationConcentration>(request.MedicationConcentrationId);
        if (medicationConcentration == null) return Results.BadRequest();

        if (!medication.Brands.Contains(request.Brand))
        {
            var brands = new List<string>();
            brands.AddRange(medication.Brands);
            brands.Add(request.Brand);
            medication.Brands = brands.ToArray();
        }

        var item = new StockItem
        {
            Medication = medication,
            MedicationConcentration = medicationConcentration,
            Brand = request.Brand,
            Measurement = request.Measurement,
            AfterOpeningLifetimeDays = request.AfterOpeningLifetimeDays,
            ReorderQuantity = request.ReorderQuantity
        };

        _repository.Create(item);
        await _repository.SaveChangesAsync();
        return Results.Ok(new { id = item.Id });
    }
}
