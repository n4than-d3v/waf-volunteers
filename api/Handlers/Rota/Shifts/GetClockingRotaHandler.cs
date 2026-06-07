using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Rota;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Rota.Shifts;

public class GetClockingRota : IRequest<IResult>
{
    public DateOnly? Date { get; set; }

    public GetClockingRota(string? date)
    {
        if (string.IsNullOrWhiteSpace(date)) return;
        Date = DateOnly.Parse(date);
    }
}

public class GetClockingRotaHandler : IRequestHandler<GetClockingRota, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IRotaService _rotaService;
    private readonly IEncryptionService _encryptionService;

    public GetClockingRotaHandler(IDatabaseRepository repository, IRotaService rotaService, IEncryptionService encryptionService)
    {
        _repository = repository;
        _rotaService = rotaService;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(GetClockingRota request, CancellationToken cancellationToken)
    {
        var now = request.Date ?? DateOnly.FromDateTime(DateTime.Now);

        var clockingRota = await _rotaService.GetRotaAsync(now, now);
        var today = clockingRota.First();

        var clockings = await _repository.GetAll<AttendanceClocking>(
            x => x.Attendance.Date == now,
            tracking: false, action: x => x.Include(y => y.Attendance));

        var visitorClockings = await _repository.GetAll<VisitorClocking>(
            x => x.Date == now, tracking: false);

        var accounts = await _repository.GetAll<Account>(x => true, tracking: false);

        var items = today.Shifts.Select(shift =>
        {
            var rotaItem = new RotaItem
            {
                Time = shift.Time,
                Volunteers = []
            };
            rotaItem.Volunteers.AddRange(shift.Jobs.SelectMany(job => job.Volunteers.Select(volunteer =>
            {
                var account = accounts.FirstOrDefault(x => x.Id == volunteer.Id);
                string[] cars = account != null
                    ? account.Cars.Select(car => _encryptionService.Decrypt(car, account.Salt)).ToArray() : [];
                var clocking = clockings.FirstOrDefault(x => x.Attendance.Id == volunteer.AttendanceId);
                return new RotaItemVolunteer
                {
                    Job = job.Job,
                    FullName = volunteer.FullName,
                    Name = volunteer.Name,
                    Confirmed = volunteer.Confirmed,
                    AttendanceId = volunteer.AttendanceId,
                    VisitorId = null,
                    Cars = cars,
                    Car = clocking?.Car,
                    In = clocking?.In.ToShortTimeString(),
                    Out = clocking?.Out?.ToShortTimeString(),
                };
            })).OrderBy(x => x.FullName));
            return rotaItem;
        }).ToList();

        var regulars = accounts
            .Where(x => x.Roles.HasFlag(AccountRoles.CLOCKING_REGULAR))
            .Select(account =>
            {
                string firstName = _encryptionService.Decrypt(account.FirstName, account.Salt);
                string lastName = _encryptionService.Decrypt(account.LastName, account.Salt);
                string[] cars = account.Cars.Select(car => _encryptionService.Decrypt(car, account.Salt)).ToArray();
                return new RotaItemRegular
                {
                    FullName = $"{firstName} {lastName}",
                    Cars = cars
                };
            })
            .OrderBy(x => x.FullName)
            .ToList();

        if (regulars.Any())
        {
            items.Insert(0, new RotaItem
            {
                Time = new TimeRange { Id = -1, Name = "Regular" },
                Volunteers = regulars.Select(regular =>
                {
                    var visitor = visitorClockings.FirstOrDefault(x => x.Name == regular.FullName);
                    return new RotaItemVolunteer
                    {
                        FullName = regular.FullName,
                        Name = regular.FullName.Split(" ")[0],
                        Confirmed = true,
                        AttendanceId = null,
                        VisitorId = visitor?.Id,
                        Cars = regular.Cars,
                        Car = visitor?.Car,
                        In = visitor?.In.ToShortTimeString(),
                        Out = visitor?.Out?.ToShortTimeString()
                    };
                }
                ).ToList()
            });
        }

        var nonRegularVisitors = visitorClockings
            .Where(visitor => !regulars.Any(regular => regular.FullName == visitor.Name)).ToList();

        if (nonRegularVisitors.Any())
        {
            items.Insert(0, new RotaItem
            {
                Time = new TimeRange { Id = -2, Name = "Extra" },
                Volunteers = nonRegularVisitors.Select(visitor => new RotaItemVolunteer
                {
                    FullName = visitor.Name,
                    Name = visitor.Name.Split(" ")[0],
                    Confirmed = true,
                    AttendanceId = null,
                    VisitorId = visitor.Id,
                    Cars = [],
                    Car = visitor.Car,
                    In = visitor.In.ToShortTimeString(),
                    Out = visitor.Out?.ToShortTimeString()
                }).ToList()
            });
        }

        return Results.Ok(items);
    }

    public class RotaItem
    {
        public TimeRange Time { get; set; }
        public List<RotaItemVolunteer> Volunteers { get; set; }
    }

    public class RotaItemVolunteer
    {
        public Job Job { get; set; }
        public string FullName { get; set; }
        public string Name { get; set; }
        public bool? Confirmed { get; set; }
        public int? AttendanceId { get; set; }
        public int? VisitorId { get; set; }
        public string[] Cars { get; set; }
        public string? Car { get; set; }
        public string? In { get; set; }
        public string? Out { get; set; }
    }

    internal class RotaItemRegular
    {
        internal string FullName { get; set; }
        internal string[] Cars { get; set; }
    }
}
