using Api.Database;
using Api.Database.Entities.Rota;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using WebPush;

namespace Api.Handlers.Rota.Shifts;

public class ClockOut : IRequest<IResult>
{
    public int AttendanceId { get; set; }
}

public class ClockOutHandler : IRequestHandler<ClockOut, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IPushService _pushService;

    public ClockOutHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IPushService pushService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _pushService = pushService;
    }

    public async Task<IResult> Handle(ClockOut request, CancellationToken cancellationToken)
    {
        var attendance = await _repository.Get<Attendance>(
            x => x.Id == request.AttendanceId,
            action: x => x.Include(y => y.Account));
        var existing = await _repository.Get<AttendanceClocking>(
            x => x.Attendance.Id == request.AttendanceId,
            action: x => x.Include(y => y.Attendance));

        if (attendance == null || existing == null) return Results.BadRequest();

        var now = TimeOnly.FromDateTime(DateTime.Now);

        existing.Out = now;

        await _repository.SaveChangesAsync();

        var account = attendance.Account;

        var subscription = _encryptionService.Decrypt(account.PushSubscription, account.Salt);
        if (!string.IsNullOrWhiteSpace(subscription))
        {
            var push = JsonConvert.DeserializeObject<PushSubscription>(subscription);
            await _pushService.Send(push, new PushNotification
            {
                Title = "Shift departure",
                Body = $"Hi, thank you for coming in! We clocked you out at {now.ToShortTimeString()}."
            });
        }

        return Results.NoContent();
    }
}
