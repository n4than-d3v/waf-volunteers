using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Admission;
using Api.Database.Entities.Hospital.Patients.Outcome;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Reports;

public class GetDashboard : IRequest<IResult>
{
}

public class GetDashboardHandler : IRequestHandler<GetDashboard, IResult>
{
    private const int StartYear = 2023;

    private readonly DateOnly _today;
    private readonly IDatabaseRepository _repository;

    public GetDashboardHandler(IDatabaseRepository repository)
    {
        _today = DateOnly.FromDateTime(DateTime.UtcNow);
        _repository = repository;
    }

    public async Task<IResult> Handle(GetDashboard request, CancellationToken cancellationToken)
    {
        return Results.Ok(new Dashboard
        {
            SpeciesRescues = await GetSpeciesRescues(cancellationToken),
            PatientsBySpecies = await GetPatientsBySpecies(cancellationToken),
            PatientsByDisposition = await GetPatientsByDisposition(cancellationToken),
            PatientsByAdmissionReason = await GetPatientsByAdmissionReason(cancellationToken),
            PatientsBySpeciesDisposition = await GetPatientsBySpeciesDisposition(cancellationToken),
            PatientAdmissionsByDate = await GetPatientAdmissionsByDate(cancellationToken)
        });
    }

    private async Task<IReadOnlyDictionary<int, IReadOnlyDictionary<string, int[]>>> GetSpeciesRescues(CancellationToken cancellationToken)
    {
        var species = await _repository
            .Query<Species>()
            .Select(s => new { s.Id, s.Name })
            .OrderBy(s => s.Name)
            .ToListAsync(cancellationToken);

        var counts = await _repository
            .Query<Patient>()
            .Where(p => p.Species != null)
            .GroupBy(p => new
            {
                p.Admitted.Year,
                p.Species.Id
            })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Id,
                Rescue = g.Count(c => c.IsRescue),
                BroughtIn = g.Count(c => !c.IsRescue)
            })
            .ToListAsync(cancellationToken);

        var countLookup = counts.ToDictionary(
            x => (x.Year, x.Id),
            x => (x.Rescue, x.BroughtIn)
        );

        var result = new Dictionary<int, IReadOnlyDictionary<string, int[]>>();

        for (int year = 2026; year <= _today.Year; year++)
        {
            var perYear = new Dictionary<string, int[]>();

            foreach (var s in species)
            {
                int[] rescues = countLookup.TryGetValue((year, s.Id), out var count)
                        ? [count.Rescue, count.BroughtIn] : [0, 0];

                if (rescues[0] > 0)
                {
                    perYear[s.Name] = rescues;
                }
            }

            result[year] = perYear;
        }

        return result;
    }

    private async Task<IReadOnlyDictionary<int, IReadOnlyDictionary<string, int>>> GetPatientsByAdmissionReason(CancellationToken cancellationToken)
    {
        var admissionReasons = await _repository
            .Query<AdmissionReason>()
            .Select(ar => new { ar.Id, ar.Description })
            .OrderBy(s => s.Description)
            .ToListAsync(cancellationToken);

        var counts = await _repository
            .Query<Patient>()
            .SelectMany(p => p.AdmissionReasons.Select(ar => new
            {
                p.Admitted.Year,
                ar.Id
            }))
            .GroupBy(x => new { x.Year, x.Id })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Id,
                Count = g.Count()
            })
            .ToListAsync(cancellationToken);

        var countLookup = counts.ToDictionary(
            x => (x.Year, x.Id),
            x => x.Count
        );

        var result = new Dictionary<int, IReadOnlyDictionary<string, int>>();

        for (int year = StartYear; year <= _today.Year; year++)
        {
            var perYear = new Dictionary<string, int>();

            foreach (var reason in admissionReasons)
            {
                perYear[reason.Description] =
                    countLookup.TryGetValue((year, reason.Id), out var count)
                        ? count
                        : 0;
            }

            result[year] = perYear;
        }

        return result;
    }

    private async Task<IReadOnlyDictionary<int, IReadOnlyDictionary<string, int>>> GetPatientsBySpecies(CancellationToken cancellationToken)
    {
        var species = await _repository
            .Query<Species>()
            .Select(s => new { s.Id, s.Name })
            .OrderBy(s => s.Name)
            .ToListAsync(cancellationToken);

        var counts = await _repository
            .Query<Patient>()
            .Where(p => p.Species != null)
            .GroupBy(p => new
            {
                p.Admitted.Year,
                p.Species.Id
            })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Id,
                Count = g.Count()
            })
            .ToListAsync(cancellationToken);

        var countLookup = counts.ToDictionary(
            x => (x.Year, x.Id),
            x => x.Count
        );

        var result = new Dictionary<int, IReadOnlyDictionary<string, int>>();

        for (int year = StartYear; year <= _today.Year; year++)
        {
            var perYear = new Dictionary<string, int>();

            foreach (var s in species)
            {
                perYear[s.Name] =
                    countLookup.TryGetValue((year, s.Id), out var count)
                        ? count
                        : 0;
            }

            result[year] = perYear;
        }

        return result;
    }

    private async Task<IReadOnlyDictionary<int, IReadOnlyDictionary<int, int>>> GetPatientsByDisposition(CancellationToken cancellationToken)
    {
        var counts = await _repository
            .Query<Patient>()
            .Where(p => p.Disposition != null)
            .GroupBy(p => new
            {
                p.Admitted.Year,
                p.Disposition
            })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Disposition,
                Count = g.Count()
            })
            .ToListAsync(cancellationToken);

        var countLookup = counts.ToDictionary(
            x => (x.Year, x.Disposition),
            x => x.Count
        );

        var dispositions = new[]
        {
            Disposition.Released,
            Disposition.Transferred,
            Disposition.DeadOnArrival,
            Disposition.DiedBefore24Hrs,
            Disposition.DiedAfter24Hrs,
            Disposition.PtsBefore24Hrs,
            Disposition.PtsAfter24Hrs
        };

        var result = new Dictionary<int, IReadOnlyDictionary<int, int>>();

        for (int year = StartYear; year <= _today.Year; year++)
        {
            var perYear = new Dictionary<int, int>();

            foreach (var disposition in dispositions)
            {
                perYear[(int)disposition] =
                    countLookup.TryGetValue((year, disposition), out var count)
                        ? count
                        : 0;
            }

            result[year] = perYear;
        }

        return result;
    }

    private async Task<IReadOnlyDictionary<int, IReadOnlyDictionary<string, int[]>>> GetPatientsBySpeciesDisposition(CancellationToken cancellationToken)
    {
        var species = await _repository
            .Query<Species>()
            .Select(s => new { s.Id, s.Name })
            .OrderBy(s => s.Name)
            .ToListAsync(cancellationToken);

        var counts = await _repository
            .Query<Patient>()
            .Where(p => p.Species != null && p.Disposition != null)
            .GroupBy(p => new
            {
                p.Admitted.Year,
                p.Species.Id,
                p.Disposition
            })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Id,
                g.Key.Disposition,
                Count = g.Count()
            })
            .ToListAsync(cancellationToken);

        var countLookup = counts.ToDictionary(
            x => (x.Year, x.Id, x.Disposition),
            x => x.Count
        );

        var dispositions = new[]
        {
            Disposition.Released,
            Disposition.Transferred,
            Disposition.DeadOnArrival,
            Disposition.DiedBefore24Hrs,
            Disposition.DiedAfter24Hrs,
            Disposition.PtsBefore24Hrs,
            Disposition.PtsAfter24Hrs
        };

        var result = new Dictionary<int, IReadOnlyDictionary<string, int[]>>();

        for (int year = StartYear; year <= _today.Year; year++)
        {
            var perYear = new Dictionary<string, int[]>();

            foreach (var s in species)
            {
                var arr = new int[dispositions.Length];

                for (int i = 0; i < dispositions.Length; i++)
                {
                    arr[i] =
                        countLookup.TryGetValue(
                            (year, s.Id, dispositions[i]),
                            out var count
                        )
                            ? count
                            : 0;
                }

                perYear[s.Name] = arr;
            }

            result[year] = perYear;
        }

        return result;
    }


    private async Task<IReadOnlyDictionary<int, IReadOnlyDictionary<DateOnly, int>>> GetPatientAdmissionsByDate(CancellationToken cancellationToken)
    {
        var counts = await _repository
            .Query<Patient>()
            .GroupBy(p => new
            {
                Date = DateOnly.FromDateTime(p.Admitted)
            })
            .Select(g => new
            {
                g.Key.Date,
                Count = g.Count()
            })
            .ToListAsync(cancellationToken);

        var countLookup = counts.ToDictionary(
            x => x.Date,
            x => x.Count
        );

        var result = new Dictionary<int, IReadOnlyDictionary<DateOnly, int>>();

        for (int year = StartYear; year <= _today.Year; year++)
        {
            var perYear = new Dictionary<DateOnly, int>();
            var end = year == _today.Year ? _today : new DateOnly(year, 12, 31);

            for (var date = new DateOnly(year, 1, 1); date <= end; date = date.AddDays(1))
            {
                perYear[date] =
                    countLookup.TryGetValue(date, out var count)
                        ? count
                        : 0;
            }

            result[year] = perYear;
        }

        return result;
    }

    public class Dashboard
    {
        public IReadOnlyDictionary<int, IReadOnlyDictionary<string, int[]>> SpeciesRescues { get; set; }
        public IReadOnlyDictionary<int, IReadOnlyDictionary<string, int>> PatientsBySpecies { get; set; }
        public IReadOnlyDictionary<int, IReadOnlyDictionary<int, int>> PatientsByDisposition { get; set; }
        public IReadOnlyDictionary<int, IReadOnlyDictionary<string, int[]>> PatientsBySpeciesDisposition { get; set; }
        public IReadOnlyDictionary<int, IReadOnlyDictionary<string, int>> PatientsByAdmissionReason { get; set; }
        public IReadOnlyDictionary<int, IReadOnlyDictionary<DateOnly, int>> PatientAdmissionsByDate { get; set; }
    }
}
