using Api.Database;
using Api.Database.Entities.Hospital.Boards;
using Api.Database.Entities.Hospital.Locations;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Husbandry;
using Api.Handlers.Hospital.Patients;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;
using System.Text.RegularExpressions;

namespace Api.Handlers.Hospital.Boards;

public class GetBoard : IRequest<IResult>
{
    public int Id { get; set; }
}

public static class InMemoryBoardTasks
{
    private struct BoardTask
    {
        internal int PenId { get; set; }
        internal int TaskId { get; set; }
    }

    private static DateOnly _lastUpdated = new();
    private static ConcurrentDictionary<BoardTask, bool> _tasksCompleted = [];

    public static void ClearIfNextDay()
    {
        var now = DateOnly.FromDateTime(DateTime.UtcNow);
        if (now != _lastUpdated)
        {
            _lastUpdated = now;
            _tasksCompleted.Clear();
        }
    }

    public static void CompleteTask(int penId, int taskId)
    {
        if (IsComplete(penId, taskId))
        {
            _tasksCompleted.TryRemove(new BoardTask { PenId = penId, TaskId = taskId }, out var _);
        }
        else
        {
            _tasksCompleted.TryAdd(new BoardTask { PenId = penId, TaskId = taskId }, true);
        }
    }

    public static bool IsComplete(int penId, int taskId)
    {
        return _tasksCompleted.ContainsKey(new BoardTask { PenId = penId, TaskId = taskId });
    }
}

public class GetBoardHandler : IRequestHandler<GetBoard, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;

    public GetBoardHandler(IDatabaseRepository repository, IEncryptionService encryptionService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(GetBoard request, CancellationToken cancellationToken)
    {
        InMemoryBoardTasks.ClearIfNextDay();

        var board = await _repository.Get<Board>(request.Id, tracking: false, x => x
            .Include(y => y.Messages)
            .Include(y => y.Areas)
                .ThenInclude(y => y.Area)
                    .ThenInclude(y => y.Pens));
        if (board == null) return Results.BadRequest();

        var showAreas = board.Areas
            .Where(x => x.DisplayType != BoardAreaDisplayType.Hidden)
            .Select(x => x.Area.Id)
            .ToList();

        var patients = await _repository.GetAll<Patient>(
            x =>
                (x.Status == PatientStatus.Inpatient || x.Status == PatientStatus.PendingHomeCare || x.Status == PatientStatus.ReadyForRelease) &&
                x.SpeciesVariant != null && x.Pen != null && showAreas.Contains(x.Pen.Area.Id), tracking: false,
            x => x.AsSplitQuery().IncludeBasicDetails().IncludeHusbandry());

        foreach (var patient in patients)
            patient.DecryptProperties(_encryptionService);

        var now = DateTime.UtcNow;

        board.Messages = board.Messages
            .Where(x => x.Start <= now && now <= x.End)
            .ToList();

        return Results.Ok(new PatientBoard
        {
            Board = board,
            Summary = GetPatientBoardSummary(patients),
            Areas = board.Areas
                .Where(x => x.DisplayType != BoardAreaDisplayType.Hidden)
                .Select(area => CreateBoardArea(patients, area))
                .Where(area => (area.Summary?.Any() ?? false) || (area.Pens?.Any() ?? false))
                .ToList()
        });
    }

    private static PatientBoardArea CreateBoardArea(IReadOnlyList<Patient> patients, BoardArea area)
    {
        var boardArea = new PatientBoardArea
        {
            DisplayType = area.DisplayType,
            Area = area,
            Pens = []
        };

        var areaPatients = patients.Where(x => x.Pen?.Area.Id == area.Area.Id).ToList();

        boardArea.Summary = GetPatientSummary(areaPatients);

        if (area.DisplayType == BoardAreaDisplayType.ShowPatients)
            boardArea.Pens = CreateBoardAreaPens(areaPatients);

        boardArea.Pens.AddRange(
            GetPensNeedingCleaning(area.Area)
        );

        return boardArea;
    }

    private static List<TimeSpan> ExpandFeedingTime(string time)
    {
        var startTime = TimeSpan.FromHours(9);   // 09:00
        var endTime = TimeSpan.FromHours(22);    // 22:00

        if (TimeSpan.TryParse(time, out var parsedTime))
        {
            return new List<TimeSpan> { parsedTime };
        }

        TimeSpan? interval = null;

        if (time == "Every hour")
        {
            interval = TimeSpan.FromHours(1);
        }

        var matchHours = Regex.Match(time, @"Every (\d+(\.\d+)?) hours?");
        if (matchHours.Success)
        {
            double intervalHours = double.Parse(matchHours.Groups[1].Value, System.Globalization.CultureInfo.InvariantCulture);
            interval = TimeSpan.FromHours(intervalHours);
        }

        var matchMinutes = Regex.Match(time, @"Every (\d+(\.\d+)?) minutes?");
        if (matchMinutes.Success)
        {
            double intervalMinutes = double.Parse(matchMinutes.Groups[1].Value, System.Globalization.CultureInfo.InvariantCulture);
            interval = TimeSpan.FromMinutes(intervalMinutes);
        }

        if (interval != null)
        {
            var results = new List<TimeSpan>();
            var current = startTime;

            while (current <= endTime)
            {
                results.Add(current);
                current = current.Add(interval.Value);
            }

            return results;
        }

        // Fallback (unknown format)
        return new List<TimeSpan> { };
    }

    private static List<PatientBoardSummary> GetPatientBoardSummary(IReadOnlyList<Patient> patients)
    {
        return patients
            .GroupBy(p => p.Species?.Name)
            .OrderBy(p => p.Key)
            .Select(speciesGroup => new PatientBoardSummary
            {
                Species = speciesGroup.Key,
                Quantity = speciesGroup.Count(),
                Variants = speciesGroup
                    .OrderBy(p => p.SpeciesVariant?.Order)
                    .GroupBy(p => p.SpeciesVariant?.FriendlyName)
                    .Select(variantGroup => new PatientBoardSummaryVariant
                    {
                        Name = variantGroup.Key,
                        Quantity = variantGroup.Count(),
                        Locations = variantGroup
                            .Select(p => p.Pen?.Reference)
                            .Where(r => !string.IsNullOrEmpty(r))
                            .Distinct()
                            .OrderBy(p => p)
                            .ToList(),
                        Feeding = variantGroup
                            .SelectMany(p => p.Feeding.Any()
                                ? p.Feeding.ToList<IFeeding>()
                                : p.SpeciesVariant!.FeedingGuidance.ToList<IFeeding>())
                            .Where(f => f.QuantityValue >= 0)
                            .SelectMany(f => ExpandFeedingTime(f.Time)
                                .Select(t => new { Feeding = f, Time = t }))
                            .GroupBy(x => x.Time)
                            .OrderBy(x => x.Key)
                            .Select(fg => new PatientBoardSummaryFeeding
                            {
                                Time = fg.Key.ToString(@"hh\:mm"),
                                Items = fg
                                    .GroupBy(fgg => new { fgg.Feeding.QuantityUnit, fgg.Feeding.Food.Name })
                                    .Select(fgg => new PatientBoardSummaryFeedingItem
                                    {
                                        Food = fgg.Key.Name,
                                        QuantityValue = fgg.Sum(f => f.Feeding.QuantityValue),
                                        QuantityUnit = fgg.Key.QuantityUnit
                                    }).ToList()
                            }).ToList()
                    }).ToList()
            }).ToList();
    }

    private static List<PatientBoardAreaPen> GetPensNeedingCleaning(Area area)
    {
        return area.Pens.Where(pen => pen.NeedsCleaning).Select(pen => new PatientBoardAreaPen
        {
            Id = pen.Id,
            Reference = pen.Reference,
            NeedsCleaning = pen.NeedsCleaning,
            Patients = []
        }).ToList();
    }

    private static List<PatientBoardAreaPen> CreateBoardAreaPens(IReadOnlyList<Patient> areaPatients)
    {
        return areaPatients
            .GroupBy(p => new
            {
                PenId = p.Pen?.Id,
                PenReference = p.Pen?.Reference
            })
            .Select(g =>
            {
                var penPatients = g.ToList();
                var penId = g.Key.PenId.Value;
                return new PatientBoardAreaPen
                {
                    Id = g.Key.PenId.Value,
                    Patients = GetPatientSummary(penPatients),
                    HasCustomDiet = penPatients.Any(patient => patient.Feeding?.Any() ?? false),
                    Morning = InMemoryBoardTasks.IsComplete(penId, 1),
                    Afternoon = InMemoryBoardTasks.IsComplete(penId, 2),
                    Evening = InMemoryBoardTasks.IsComplete(penId, 3),
                    Feedings = GetPatientBoardAreaPenFeedings(g.Key.PenId.Value, penPatients),
                    Tags = penPatients.SelectMany(p => p.Tags).Select(d => d.Name).Distinct().ToList(),
                    Reference = g.Key.PenReference
                };
            })
            .OrderBy(x => x.Reference)
            .ToList();
    }

    private static List<PatientBoardAreaPenFeeding> GetPatientBoardAreaPenFeedings(int penId, IReadOnlyList<Patient> patients)
    {
        var feedings = new List<PatientBoardAreaPenFeeding>();

        var times = patients
            .SelectMany(patient => patient.Feeding.Any()
                ? patient.Feeding.ToList<IFeeding>()
                : patient.SpeciesVariant!.FeedingGuidance.ToList<IFeeding>())
            .Where(f => f.QuantityValue >= 0)
            .SelectMany(f => ExpandFeedingTime(f.Time)
                .Select(t => new { Feeding = f, Time = t }))
            .GroupBy(f => f.Time)
            .OrderBy(g => g.Key);

        foreach (var timeGroup in times)
        {
            var groups = timeGroup
                .GroupBy(f => new { f.Feeding.QuantityUnit, f.Feeding.Food.Name, f.Feeding.Food.ForceFeed })
                .OrderBy(g => g.Key.Name);

            if (!groups.Any()) continue;

            var details = groups.Select(group => new PatientBoardAreaPenTaskDetails
            {
                Food = group.Key.Name,
                ForceFeed = group.Key.ForceFeed,
                QuantityEach = group.Average(g => g.Feeding.QuantityValue),
                QuantityTotal = group.Sum(g => g.Feeding.QuantityValue),
                QuantityUnit = group.Key.QuantityUnit,
                Notes = string.Join(" ", group.Where(g => !string.IsNullOrWhiteSpace(g.Feeding.Notes))
                                               .Select(g => g.Feeding.Notes)
                                               .Distinct()),
                Dish = string.Join(" ", group.Where(g => !string.IsNullOrWhiteSpace(g.Feeding.Dish))
                                               .Select(g => g.Feeding.Dish)
                                               .Distinct()),
                TopUp = group.Any(g => g.Feeding.TopUp)
            }).ToArray();

            feedings.Add(new PatientBoardAreaPenFeeding
            {
                Time = timeGroup.Key.ToString(@"hh\:mm"),
                Details = details,
            });
        }

        return feedings;
    }

    private static List<string> GetPatientSummary(IReadOnlyList<Patient> patients)
    {
        return patients
                .OrderBy(p => p.Species?.Id).ThenBy(p => p.SpeciesVariant?.Order)
                .GroupBy(p => new
                {
                    VariantName = p.SpeciesVariant?.FriendlyName
                })
                .Select(g => $"{g.Count()}x {g.Key.VariantName}")
                .ToList();
    }

    public class PatientBoard
    {
        public Board Board { get; set; }
        public List<PatientBoardArea> Areas { get; set; }
        public List<PatientBoardSummary> Summary { get; set; }
    }

    public class PatientBoardSummary
    {
        public string Species { get; set; }
        public int Quantity { get; set; }
        public List<PatientBoardSummaryVariant> Variants { get; set; } = new();
    }

    public class PatientBoardSummaryVariant
    {
        public string Name { get; set; }
        public int Quantity { get; set; }
        public List<string> Locations { get; set; } = new();
        public List<PatientBoardSummaryFeeding> Feeding { get; set; } = new();
    }

    public class PatientBoardSummaryFeeding
    {
        public string Time { get; set; }
        public List<PatientBoardSummaryFeedingItem> Items { get; set; }
    }

    public class PatientBoardSummaryFeedingItem
    {
        public decimal QuantityValue { get; set; }
        public string QuantityUnit { get; set; }
        public string Food { get; set; }
    }

    public class PatientBoardArea
    {
        public BoardArea Area { get; set; }
        public BoardAreaDisplayType DisplayType { get; set; }
        public List<string>? Summary { get; set; }
        public List<PatientBoardAreaPen>? Pens { get; set; }
    }

    public class PatientBoardAreaPen
    {
        public int Id { get; set; }
        public string Reference { get; set; }
        public List<string> Patients { get; set; }
        public List<string> Tags { get; set; }

        public bool HasCustomDiet { get; set; }

        public bool Morning { get; set; }
        public bool Afternoon { get; set; }
        public bool Evening { get; set; }

        public List<PatientBoardAreaPenFeeding> Feedings { get; set; }
        public bool NeedsCleaning { get; set; }
    }

    public class PatientBoardAreaPenFeeding
    {
        public string Time { get; set; }
        public PatientBoardAreaPenTaskDetails[] Details { get; set; }
    }

    public class PatientBoardAreaPenTaskDetails
    {
        public decimal QuantityEach { get; set; }
        public decimal QuantityTotal { get; set; }
        public string QuantityUnit { get; set; }
        public string Food { get; set; }
        public bool ForceFeed { get; set; }
        public bool TopUp { get; set; }
        public string Notes { get; set; }
        public string Dish { get; set; }
    }
}
