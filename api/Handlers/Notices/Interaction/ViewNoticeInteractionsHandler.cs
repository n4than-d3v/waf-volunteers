using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Notices;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Notices.Interaction;

public class ViewNoticeInteractions : IRequest<IResult>
{
    public int NoticeId { get; set; }
}

public class ViewNoticeInteractionsHandler : IRequestHandler<ViewNoticeInteractions, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;

    public ViewNoticeInteractionsHandler(IDatabaseRepository repository, IEncryptionService encryptionService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(ViewNoticeInteractions request, CancellationToken cancellationToken)
    {
        var notice = await _repository.Get<Notice>(request.NoticeId, tracking: false);
        if (notice == null) return Results.BadRequest();

        var interactions = await _repository.GetAll<NoticeInteraction>(
            x => x.Notice.Id == request.NoticeId, tracking: false,
            action: x => x.Include(y => y.Notice).Include(y => y.Account));
        var accounts = await _repository.GetAll<Account>(x => true, tracking: false);

        var users = new List<UserNotice>();

        foreach (var account in accounts)
        {
            if (!notice.ShouldShow(account)) continue;

            var firstName = _encryptionService.Decrypt(account.FirstName, account.Salt);
            var lastName = _encryptionService.Decrypt(account.LastName, account.Salt);
            users.Add(new UserNotice
            {
                Name = $"{firstName} {lastName}",
                Interactions = interactions
                    .Where(x => x.Account.Id == account.Id)
                    .OrderByDescending(x => x.Opened)
                    .Select(x => new UserNoticeInteraction
                    {
                        Opened = x.Opened,
                        Closed = x.Closed
                    }).ToList()
            });
        }

        return Results.Ok(users.OrderBy(x => x.Name));
    }

    public class UserNotice
    {
        public string Name { get; set; }
        public bool Read => Interactions.Any();
        public List<UserNoticeInteraction> Interactions { get; set; }
    }

    public class UserNoticeInteraction
    {
        public DateTime Opened { get; set; }
        public DateTime? Closed { get; set; }

        private static DateTime FloorToSeconds(DateTime dt)
        {
            return new DateTime(
                dt.Year, dt.Month, dt.Day,
                dt.Hour, dt.Minute, dt.Second,
                dt.Kind
            );
        }

        private static string ConvertTimeSpan(TimeSpan duration)
        {
            string formatted = $"{duration.Seconds} second{(duration.Seconds != 1 ? "s" : "")}";
            if (duration.TotalMinutes < 1) return formatted;
            formatted = $"{duration.Minutes} minute{(duration.Minutes != 1 ? "s" : "")} " + formatted;
            if (duration.TotalHours < 1) return formatted;
            return $"{duration.Hours} hour{(duration.Hours != 1 ? "s" : "")} " + formatted;
        }

        private TimeSpan GetTimeSpan()
        {
            return FloorToSeconds(Closed!.Value) - FloorToSeconds(Opened);
        }

        public string Duration
        {
            get
            {
                if (Closed == null) return string.Empty;

                var duration = GetTimeSpan();
                return ConvertTimeSpan(duration);
            }
        }

        public double? DurationSeconds => Closed.HasValue ? GetTimeSpan().TotalSeconds : null;
    }
}
