using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Rota;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using WebPush;

namespace Api.Handlers.Rota.Misc.Assignments;

public class AssignArea : IRequest<IResult>
{
    public int AttendanceId { get; set; }
    public int AssignableAreaId { get; set; }
}

public class AssignAreaHandler : IRequestHandler<AssignArea, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IPushService _pushService;

    public AssignAreaHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IPushService pushService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _pushService = pushService;
    }

    public async Task<IResult> Handle(AssignArea request, CancellationToken cancellationToken)
    {
        var attendance = await _repository.Get<Attendance>(
            x => x.Id == request.AttendanceId, tracking: true,
            action: x => x.Include(y => y.Account).Include(y => y.Time));
        var assignableArea = await _repository.Get<AssignableArea>(x => x.Id == request.AssignableAreaId);
        if (attendance == null || assignableArea == null) return Results.BadRequest();

        var existing = await _repository.Get<Assignment>(
            x => x.Attendance.Id == request.AttendanceId, tracking: true,
            action: x => x.Include(y => y.Attendance).Include(y => y.Area));

        if (existing == null)
        {
            _repository.Create(new Assignment
            {
                Attendance = attendance,
                Area = assignableArea
            });
        }
        else
        {
            existing.Area = assignableArea;
        }

        await _repository.SaveChangesAsync();

        var account = attendance.Account;

        var subscription = _encryptionService.Decrypt(account.PushSubscription, account.Salt);
        if (!string.IsNullOrWhiteSpace(subscription))
        {
            var push = JsonConvert.DeserializeObject<PushSubscription>(subscription);
            await _pushService.Send(push, new PushNotification
            {
                Title = "Area assignment",
                Body = $"You have been assigned to {assignableArea.Name} for your {attendance.Date.DayOfWeek} {attendance.Time.Name.ToLower()} shift on {attendance.Date:dd MMMM yyyy}"
            });
        }

        return Results.NoContent();
    }
}
