using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using Api.Handlers.Hospital.Patients;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Reports;

public class GetPatientSummary : IRequest<IResult> { }

public class GetPatientSummaryHandler : IRequestHandler<GetPatientSummary, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetPatientSummaryHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetPatientSummary request, CancellationToken cancellationToken)
    {
        var patients = await _repository.GetAll<Patient>(
            x =>
                (x.Status == PatientStatus.Inpatient || x.Status == PatientStatus.PendingHomeCare || x.Status == PatientStatus.ReadyForRelease) &&
                x.Species != null && x.SpeciesVariant != null, tracking: false,
            x => x.AsSplitQuery().IncludeBasicDetails());

        var summary = new PatientSummary
        {
            Species = patients
                .GroupBy(p => new { p.Species.Id, p.Species.Name, p.Species.SpeciesType })
                .OrderBy(g => g.Key != null ? g.Key.Name : "")
                .Select(speciesGroup => new PatientSummarySpecies
                {
                    Name = speciesGroup.Key != null ? speciesGroup.Key.Name : "Unknown",
                    SpeciesType = speciesGroup.Key.SpeciesType,
                    Variants = speciesGroup
                        .GroupBy(p => new { p.SpeciesVariant.Id, p.SpeciesVariant.FriendlyName, p.SpeciesVariant.Order })
                        .OrderBy(g => g.Key != null ? g.Key.Order : 0)
                        .Select(variantGroup => new PatientSummarySpeciesVariant
                        {
                            Name = variantGroup.Key != null ? variantGroup.Key.FriendlyName : "Unknown",
                            Total = variantGroup.Count()
                        })
                        .ToList()
                })
                .ToList()
        };

        return Results.Ok(summary);
    }
}

public class PatientSummary
{
    public int Total => Species.Sum(x => x.Total);
    public int UniqueSpecies => Species.Count;

    public int Mammals => Species.Where(x => x.SpeciesType == SpeciesType.Mammal).Sum(x => x.Total);
    public int OtherBirds => Species.Where(x => x.SpeciesType == SpeciesType.Bird).Sum(x => x.Total);
    public int Amphibians => Species.Where(x => x.SpeciesType == SpeciesType.Amphibian).Sum(x => x.Total);
    public int Reptiles => Species.Where(x => x.SpeciesType == SpeciesType.Reptile).Sum(x => x.Total);
    public int Waterfowl => Species.Where(x => x.SpeciesType == SpeciesType.Waterfowl).Sum(x => x.Total);
    public int Pigeons => Species.Where(x => x.SpeciesType == SpeciesType.Pigeons).Sum(x => x.Total);
    public int Raptors => Species.Where(x => x.SpeciesType == SpeciesType.Raptors).Sum(x => x.Total);
    public int Rodents => Species.Where(x => x.SpeciesType == SpeciesType.Rodents).Sum(x => x.Total);

    public List<PatientSummarySpecies> Species { get; set; }
}

public class PatientSummarySpecies
{
    public int Total => Variants.Sum(x => x.Total);
    public string Name { get; set; }
    public SpeciesType SpeciesType { get; set; }
    public List<PatientSummarySpeciesVariant> Variants { get; set; }
}

public class PatientSummarySpeciesVariant
{
    public int Total { get; set; }
    public string Name { get; set; }
}