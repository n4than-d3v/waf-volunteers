using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Rota;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using WebPush;

namespace Api.Handlers.Rota.Shifts;

public class GetClockingRota : IRequest<IResult>
{
    public DateOnly? Date { get; set; }
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
        var now = DateOnly.FromDateTime(DateTime.Now);

        var clockingRota = await _rotaService.GetRotaAsync(now, now);
        var today = clockingRota.First();

        var clockings = await _repository.GetAll<AttendanceClocking>(
            x => x.Attendance.Date == now,
            tracking: false, action: x => x.Include(y => y.Attendance));

        var accounts = await _repository.GetAll<Account>(x => true, tracking: false);

        var items = today.Shifts.Select(shift => new RotaItem
        {
            Time = shift.Time,
            Jobs = shift.Jobs.Select(job => new RotaItemJob
            {
                Job = job.Job,
                Volunteers = job.Volunteers.Select(volunteer =>
                {
                    var account = accounts.FirstOrDefault(x => x.Id == volunteer.Id);
                    string[] cars = account != null 
                        ? account.Cars.Select(car => _encryptionService.Decrypt(car, account.Salt)).ToArray() : [];
                    var clocking = clockings.FirstOrDefault(x => x.Attendance.Id == volunteer.AttendanceId);
                    return new RotaItemJobVolunteer
                    {
                        FullName = volunteer.FullName,
                        Name = volunteer.Name,
                        Confirmed = volunteer.Confirmed,
                        AttendanceId = volunteer.AttendanceId,
                        Cars = cars,
                        Car = clocking?.Car,
                        In = clocking?.In.ToShortTimeString(),
                        Out = clocking?.Out?.ToShortTimeString(),
                    };
                }).ToArray()
            }).ToArray()
        }).ToArray();

        return Results.Ok(items);
    }

    public class RotaItem
    {
        public TimeRange Time { get; set; }
        public RotaItemJob[] Jobs { get; set; }
    }

    public class RotaItemJob
    {
        public Job Job { get; set; }
        public RotaItemJobVolunteer[] Volunteers { get; set; }
    }

    public class RotaItemJobVolunteer
    {
        public string FullName { get; set; }
        public string Name { get; set; }
        public bool? Confirmed { get; set; }
        public int? AttendanceId { get; set; }
        public string[] Cars { get; set; }
        public string? Car { get; set; }
        public string? In { get; set; }
        public string? Out { get; set; }
    }
}

