using Api.Database;
using Api.Database.Entities.Rota;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using WebPush;

namespace Api.Handlers.Rota.Shifts;

public class ClockIn : IRequest<IResult>
{
    public int AttendanceId { get; set; }
    public string? Car { get; set; }
}

public class ClockInHandler : IRequestHandler<ClockIn, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IPushService _pushService;

    public ClockInHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IPushService pushService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _pushService = pushService;
    }

    public async Task<IResult> Handle(ClockIn request, CancellationToken cancellationToken)
    {
        var attendance = await _repository.Get<Attendance>(
            x => x.Id == request.AttendanceId,
            action: x => x.Include(y => y.Account));
        if (attendance == null) return Results.BadRequest();

        var now = TimeOnly.FromDateTime(DateTime.Now);

        var existing = await _repository.Get<AttendanceClocking>(
            x => x.Attendance.Id == request.AttendanceId,
            action: x => x.Include(y => y.Attendance)); if (existing != null)
        {
            existing.In = now;
        }
        else
        {
            _repository.Create(new AttendanceClocking
            {
                Attendance = attendance,
                Car = request.Car,
                In = now
            });
        }
        await _repository.SaveChangesAsync();

        var account = attendance.Account;

        var subscription = _encryptionService.Decrypt(account.PushSubscription, account.Salt);
        if (!string.IsNullOrWhiteSpace(subscription))
        {
            var push = JsonConvert.DeserializeObject<PushSubscription>(subscription);
            await _pushService.Send(push, new PushNotification
            {
                Title = "Shift arrival",
                Body = $"Hi, thank you for coming in! We clocked you in at {now.ToShortTimeString()}."
            }, account.Id);
        }

        await _pushService.RemoveInactiveSubscriptions();

        return Results.NoContent();
    }
}
