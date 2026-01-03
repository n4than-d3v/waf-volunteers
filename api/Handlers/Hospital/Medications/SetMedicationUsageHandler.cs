using Api.Database;
using Api.Database.Entities.Hospital.Patients.Medications;
using MediatR;

namespace Api.Handlers.Hospital.Medications;

public class SetMedicationUsage : IRequest<IResult>
{
    public int Id { get; set; }
    public bool Used { get; set; }
}

public class SetMedicationUsageHandler : IRequestHandler<SetMedicationUsage, IResult>
{
    private readonly IDatabaseRepository _repository;

    public SetMedicationUsageHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(SetMedicationUsage request, CancellationToken cancellationToken)
    {
        var medication = await _repository.Get<Medication>(request.Id);
        if (medication == null) return Results.BadRequest();

        medication.Used = request.Used;

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
