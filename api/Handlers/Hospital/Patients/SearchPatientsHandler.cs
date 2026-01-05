using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using MediatR;
using Microsoft.EntityFrameworkCore;
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
        IQueryable<Patient> Action(DbSet<Patient> x) => x
            .AsSplitQuery()
            .IncludeAdmission()
            .IncludeBasicDetails()
            .IncludeHusbandry();

        Patient? patient = null;

        // Patient id without year
        if (int.TryParse(request.Search, out int number))
        {
            var thisYearReference = $"{DateTime.UtcNow.Year}-{number}";
            var previousYearReference = $"{DateTime.UtcNow.Year}-{number}";
            patient ??= await _repository.Get<Patient>(x => x.Reference == thisYearReference, tracking: false, Action);
            patient ??= await _repository.Get<Patient>(x => x.Reference == previousYearReference, tracking: false, Action);
        }

        // Patient id with year
        if (Regex.IsMatch(request.Search, @"^\d\d-\d+$"))
        {
            var reference = request.Search;
            patient ??= await _repository.Get<Patient>(x => x.Reference == reference, tracking: false, Action);
        }

        // Search by name
        patient ??= await _repository.Get<Patient>(x => x.Name != null && x.Name.ToUpper().Contains(request.Search), tracking: false, Action);

        return Results.NotFound();
    }
}
