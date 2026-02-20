using Api.Database;
using Api.Database.Entities.Hospital.Patients.Medications;
using MediatR;

namespace Api.Handlers.Hospital.Medications;

public class ManageMedication : IRequest<IResult>
{
    public int? Id { get; set; }
    public bool? Delete { get; set; }

    public string ActiveSubstance { get; set; }
    public string[] Brands { get; set; }
    public string Notes { get; set; }
}

public class ManageMedicationHandler : IRequestHandler<ManageMedication, IResult>
{
    private readonly IDatabaseRepository _repository;

    public ManageMedicationHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(ManageMedication request, CancellationToken cancellationToken)
    {
        var brands = (request.Brands ?? []).Select(x => x.Trim()).ToArray();

        if (request.Id == null)
        {
            var medication = new Medication
            {
                ActiveSubstance = request.ActiveSubstance,
                Brands = brands,
                Notes = request.Notes
            };

            _repository.Create(medication);
        }
        else
        {
            var medication = await _repository.Get<Medication>(request.Id.Value);
            if (medication == null) return Results.BadRequest();

            if (request.Delete ?? false)
            {
                _repository.Delete(medication);
            }
            else
            {
                medication.ActiveSubstance = request.ActiveSubstance;
                medication.Brands = brands;
                medication.Notes = request.Notes;
            }
        }

        await _repository.SaveChangesAsync();
        return Results.Accepted();
    }
}
