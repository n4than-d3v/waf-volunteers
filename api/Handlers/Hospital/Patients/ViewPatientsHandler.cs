using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Outcome;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Patients;

public class ViewPatients : IRequest<IResult>
{
    public PatientStatus Status { get; set; }
    public string Search { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 50;
    public SortPatientsBy SortBy { get; set; } = SortPatientsBy.Admitted;
}

public enum SortPatientsBy
{
    Admitted = 1,
    Species = 2,
    Location = 3,
    HomeCarer = 4,
    LastUpdatedStatus = 5,
    Dispositioned = 6,
    PlannedRelease = 7
}

public class ViewPatientsHandler : IRequestHandler<ViewPatients, IResult>
{
    private readonly IDatabaseRepository _repository;

    public ViewPatientsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(ViewPatients request, CancellationToken cancellationToken)
    {
        request.Search ??= string.Empty;
        request.Search = request.Search.ToUpper();

        int total = 0;

        var patients = await _repository.GetAll<Patient>(
            x => true,
            tracking: false,
            x =>
            {
                var filtered = ApplyFilter(request, x);
                total = filtered.Count();
                var ordered = ApplySort(request, filtered);

                return ordered
                    .Skip((request.Page - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .AsSplitQuery()
                    .Include(y => y.SuspectedSpecies)
                    .Include(y => y.InitialLocation)
                    .Include(y => y.AdmissionReasons)
                    .Include(y => y.Species)
                    .Include(y => y.SpeciesVariant)
                    .Include(y => y.Pen).ThenInclude(y => y.Area)
                    .Include(y => y.Movements).ThenInclude(m => m.To).ThenInclude(p => p.Area)
                    .Include(y => y.Movements).ThenInclude(m => m.From).ThenInclude(p => p.Area)
                    .Include(y => y.HomeCareRequests)
                    .Include(y => y.HomeCareMessages).ThenInclude(m => m.Author);
            }
        );

        var mapped = patients.Select(Map).ToList();

        return Results.Ok(new { total, patients = mapped });
    }

    private IQueryable<Patient> ApplyFilter(ViewPatients request, DbSet<Patient> x)
    {
        return x.Where(y =>
            y.Status == request.Status
            && (
                request.Search == ""
                || y.Reference.ToUpper().Contains(request.Search)
                || (y.Name != null && y.Name.ToUpper().Contains(request.Search))
                || (
                    y.CurrentHomeCarer != null
                    && y.CurrentHomeCarer.ToUpper().Contains(request.Search)
                )
                || (
                    y.SuspectedSpecies != null
                    && y.SuspectedSpecies.Description.ToUpper().Contains(request.Search)
                )
                || (
                    y.InitialLocation != null
                    && y.InitialLocation.Description.ToUpper().Contains(request.Search)
                )
                || (y.Species != null && y.Species.Name.ToUpper().Contains(request.Search))
                || (
                    y.SpeciesVariant != null
                    && y.SpeciesVariant.FriendlyName.ToUpper().Contains(request.Search)
                )
                || (
                    y.Pen != null
                    && y.Pen.Area != null
                    && (y.Pen.Area.Code + "-" + y.Pen.Code).ToUpper().Contains(request.Search)
                )
                || (
                    y.Movements != null &&
                    y.Movements.Any(m =>
                        m.From != null &&
                        m.From.Area != null &&
                        (m.From.Area.Code + "-" + m.From.Code).ToUpper().Contains(request.Search))
                )
            )
        );
    }

    private IOrderedQueryable<Patient> ApplySort(ViewPatients request, IQueryable<Patient> query)
    {
        return request.SortBy switch
        {
            SortPatientsBy.Admitted => query.OrderByDescending(x => x.Admitted),

            SortPatientsBy.Location => query
                .OrderBy(y =>
                    y.Pen != null && y.Pen.Area != null ? (y.Pen.Area.Code + "-" + y.Pen.Code) : ""
                )
                .ThenByDescending(y => y.Admitted),

            SortPatientsBy.Species => query
                .OrderBy(y =>
                    y.Species != null ? y.Species.Name
                    : y.SuspectedSpecies != null ? y.SuspectedSpecies.Description
                    : ""
                )
                .ThenBy(y => y.SpeciesVariant != null ? y.SpeciesVariant.Order : 0)
                .ThenByDescending(y => y.Admitted),

            SortPatientsBy.HomeCarer => query
                .OrderBy(y => y.CurrentHomeCarer)
                .ThenByDescending(y =>
                    y.HomeCareRequests.Where(r => r.Dropoff == null && r.Pickup != null)
                        .Max(r => r.Pickup)
                    ?? DateTime.MinValue
                ),

            SortPatientsBy.LastUpdatedStatus => query
                .OrderBy(y => y.LastUpdatedStatus)
                .ThenByDescending(y => y.Admitted),

            SortPatientsBy.Dispositioned => query
                .OrderByDescending(y => y.Dispositioned)
                .ThenByDescending(y => y.Admitted),

            SortPatientsBy.PlannedRelease => query
                .OrderBy(y => y.PlannedRelease ?? DateTime.MinValue)
                .ThenByDescending(y => y.LastUpdatedStatus),

            _ => query.OrderByDescending(x => x.Admitted),
        };
    }

    private ListPatient Map(Patient patient)
    {
        var latestHomeCareRequest = (patient.HomeCareRequests ?? [])
            .OrderByDescending(x => x.Requested).FirstOrDefault();

        return new ListPatient
        {
            Id = patient.Id,
            Admitted = patient.Admitted,
            Reference = patient.Reference,
            Status = patient.Status,
            InitialLocation = patient.InitialLocation.Description,
            SuspectedSpecies = patient.SuspectedSpecies.Description,
            AdmissionReasons = [.. (patient.AdmissionReasons ?? []).Select(x => x.Description)],
            LastUpdatedStatus = patient.LastUpdatedStatus,
            UniqueIdentifier = patient.UniqueIdentifier,
            Species = patient.Species?.Name,
            SpeciesVariant = patient.SpeciesVariant?.Name,
            SpeciesVariantFriendlyName = patient.SpeciesVariant?.FriendlyName,
            IsLongTerm = patient.IsLongTerm,
            IsOutdated = patient.IsOutdated,
            Pen = patient.Pen?.Reference,
            Disposition = patient.Disposition,
            Dispositioned = patient.Dispositioned,
            HomeCareRequested = latestHomeCareRequest?.Requested,
            HomeCareSince = latestHomeCareRequest?.Pickup,
            CurrentHomeCarer = patient.CurrentHomeCarer,
            LastMessageSentByOrphanFeeder = patient.LastMessageSentByOrphanFeeder,
            PlannedRelease = patient.PlannedRelease,
            IsReleasePlanned = patient.IsReleasePlanned,
            IsReleaseOverdue = patient.IsReleaseOverdue
        };
    }

    public class ListPatient
    {
        public int Id { get; set; }
        public DateTime Admitted { get; set; }
        public string Reference { get; set; }
        public PatientStatus Status { get; set; }
        public string InitialLocation { get; set; }
        public string SuspectedSpecies { get; set; }
        public string[] AdmissionReasons { get; set; }
        public DateTime LastUpdatedStatus { get; set; }
        public string? UniqueIdentifier { get; set; }
        public string? Species { get; set; }
        public string? SpeciesVariant { get; set; }
        public string? SpeciesVariantFriendlyName { get; set; }
        public bool IsLongTerm { get; set; }
        public bool IsOutdated { get; set; }
        public string? Pen { get; set; }
        public Disposition? Disposition { get; set; }
        public DateTime? Dispositioned { get; set; }
        public DateTime? HomeCareRequested { get; set; }
        public DateTime? HomeCareSince { get; set; }
        public string? CurrentHomeCarer { get; set; }
        public bool? LastMessageSentByOrphanFeeder { get; set; }
        public DateTime? PlannedRelease { get; set; }
        public bool IsReleasePlanned { get; set; }
        public bool IsReleaseOverdue { get; set; }
    }
}
