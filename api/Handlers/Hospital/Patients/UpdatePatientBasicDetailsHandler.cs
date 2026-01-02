using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Husbandry;
using MediatR;

namespace Api.Handlers.Hospital.Patients;

public class UpdatePatientBasicDetails : IRequest<IResult>
{
    public int PatientId { get; set; }
    public string Name { get; set; }
    public string UniqueIdentifier { get; set; }
    public int SpeciesId { get; set; }
    public int SpeciesVariantId { get; set; }
    public List<int> TagIds { get; set; }
    public List<int> DietIds { get; set; }
}

public class UpdatePatientBasicDetailsHandler : IRequestHandler<UpdatePatientBasicDetails, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpdatePatientBasicDetailsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpdatePatientBasicDetails request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId, action: x => x.IncludeHusbandry());
        if (patient == null) return Results.BadRequest();

        var species = await _repository.Get<Species>(request.SpeciesId);
        if (species == null) return Results.BadRequest();

        var speciesVariant = await _repository.Get<SpeciesVariant>(request.SpeciesVariantId);
        if (speciesVariant == null) return Results.BadRequest();

        var tags = await _repository.GetAll<Tag>(x => true);
        var diets = await _repository.GetAll<Diet>(x => true);

        patient.Name = request.Name;
        patient.UniqueIdentifier = request.UniqueIdentifier;
        patient.Species = species;
        patient.SpeciesVariant = speciesVariant;
        patient.Tags.RemoveAll(x => !request.TagIds.Contains(x.Id));
        patient.Tags.AddRange(tags.Where(x => request.TagIds.Contains(x.Id)));
        patient.Diets.RemoveAll(x => !request.DietIds.Contains(x.Id));
        patient.Diets.AddRange(diets.Where(x => request.DietIds.Contains(x.Id)));

        await _repository.SaveChangesAsync();
        return Results.NoContent();
    }
}
