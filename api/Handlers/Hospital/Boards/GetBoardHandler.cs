using Api.Database;
using Api.Database.Entities.Hospital.Boards;
using Api.Database.Entities.Hospital.Locations;
using Api.Database.Entities.Hospital.Patients;
using Api.Handlers.Hospital.Patients;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Boards;

public class GetBoard : IRequest<IResult>
{
    public int Id { get; set; }
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
        var board = await _repository.Get<Board>(request.Id, tracking: false, x => x
            .Include(y => y.Messages)
            .Include(y => y.Areas)
                .ThenInclude(y => y.Area));
        if (board == null) return Results.BadRequest();

        var showAreas = board.Areas
            .Where(x => x.DisplayType != BoardAreaDisplayType.Hidden)
            .Select(x => x.Area.Id)
            .ToList();

        var patients = await _repository.GetAll<Patient>(
            x =>
                (x.Status == PatientStatus.Inpatient || x.Status == PatientStatus.PendingHomeCare) &&
                x.Pen != null && showAreas.Contains(x.Pen.Area.Id), tracking: false,
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
            Areas = board.Areas
                .Where(x => x.DisplayType != BoardAreaDisplayType.Hidden)
                .Select(area => CreateBoardArea(patients, area))
                .Where(area => (area.Summary?.Any() ?? false) || (area.Pens?.Any() ?? false))
                .ToList()
        });
    }

    private static PatientBoardArea CreateBoardArea(IReadOnlyList<Patient> patients, BoardArea area)
    {
        var boardArea = new PatientBoardArea { Area = area };

        var areaPatients = patients.Where(x => x.Pen?.Area.Id == area.Area.Id).ToList();

        if (area.DisplayType == BoardAreaDisplayType.SummarisePatients)
            boardArea.Summary = GetPatientSummary(areaPatients);

        if (area.DisplayType == BoardAreaDisplayType.ShowPatients)
            boardArea.Pens = CreateBoardAreaPens(areaPatients);

        return boardArea;
    }

    private static List<PatientBoardAreaPen> CreateBoardAreaPens(IReadOnlyList<Patient> areaPatients)
    {
        return areaPatients
            .GroupBy(p => new
            {
                PenId = p.Pen?.Id,
                PenReference = p.Pen?.Reference
            })
            .Select(g => new PatientBoardAreaPen
            {
                Reference = g.Key.PenReference,
                Patients = g.ToList()
            }).ToList();
    }

    private static List<string> GetPatientSummary(IReadOnlyList<Patient> areaPatients)
    {
        return areaPatients
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
    }

    public class PatientBoardArea
    {
        public BoardArea Area { get; set; }
        public List<string>? Summary { get; set; }
        public List<PatientBoardAreaPen>? Pens { get; set; }
    }

    public class PatientBoardAreaPen
    {
        public string Reference { get; set; }
        public List<Patient> Patients { get; set; }
    }
}
