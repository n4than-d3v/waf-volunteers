using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using MediatR;
using System.Text.RegularExpressions;

namespace Api.Handlers.Hospital.Patients;

public class SearchPatients : IRequest<IResult>
{
    public string Search { get; set; }
}

public class SearchPatientsHandler : IRequestHandler<SearchPatients, IResult>
{
    private readonly IDatabaseRepository _repository;

    public SearchPatientsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(SearchPatients request, CancellationToken cancellationToken)
    {
        Patient? patient = null;

        // Patient id without year
        if (int.TryParse(request.Search, out int number))
        {
            var thisYearReference = $"{DateTime.UtcNow.Year - 2000}-{number}";
            var previousYearReference = $"{DateTime.UtcNow.Year - 2001}-{number}";
            patient ??= await _repository.Get<Patient>(x => x.Reference == thisYearReference, tracking: false, action: x => x.IncludeAdmission().IncludeBasicDetails());
            patient ??= await _repository.Get<Patient>(x => x.Reference == previousYearReference, tracking: false, action: x => x.IncludeAdmission().IncludeBasicDetails());
        }

        // Patient id with year
        if (Regex.IsMatch(request.Search, @"^\d\d-\d+$"))
        {
            var reference = request.Search;
            patient ??= await _repository.Get<Patient>(x => x.Reference == reference, tracking: false, action: x => x.IncludeAdmission().IncludeBasicDetails());
        }

        // WRMD reference
        patient ??= await _repository.Get<Patient>(x => x.Reference == request.Search || x.Reference == "WRMD-" + request.Search, tracking: false, action: x => x.IncludeAdmission().IncludeBasicDetails());

        // Search by name
        patient ??= await _repository.Get<Patient>(x => x.Name != null && x.Name.ToUpper().Contains(request.Search), tracking: false, action: x => x.IncludeAdmission().IncludeBasicDetails());

        if (patient == null) return Results.NotFound();
        return Results.Ok(new
        {
            id = patient.Id,
            reference = patient.Reference,
            species = patient.Species?.Name ?? patient.SuspectedSpecies?.Description
        });
    }
}
