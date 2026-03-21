using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Notices;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Notices.Interaction;

public class ViewNoticeInteractionSummary : IRequest<IResult>
{
}

public class ViewNoticeInteractionSummaryHandler : IRequestHandler<ViewNoticeInteractionSummary, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;

    public ViewNoticeInteractionSummaryHandler(IDatabaseRepository repository, IEncryptionService encryptionService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(ViewNoticeInteractionSummary request, CancellationToken cancellationToken)
    {
        // Run report on all sent notices for active users
        var notices = await _repository.GetAll<Notice>(x => x.Sent, tracking: false);
        var accounts = await _repository.GetAll<Account>(x => x.Status == AccountStatus.Active, tracking: false);

        var users = new Dictionary<int, UserNoticeSummary>();

        foreach (var notice in notices)
        {
            var interactions = await _repository.GetAll<NoticeInteraction>(
                x => x.Notice.Id == notice.Id, tracking: false,
                action: x => x.Include(y => y.Notice).Include(y => y.Account));

            foreach (var account in accounts)
            {
                if (!notice.ShouldShow(account)) continue;

                UserNoticeSummary summary = new UserNoticeSummary();
                if (users.TryGetValue(account.Id, out UserNoticeSummary? value))
                {
                    summary = value;
                }
                else
                {
                    users.Add(account.Id, summary);

                    var firstName = _encryptionService.Decrypt(account.FirstName, account.Salt);
                    var lastName = _encryptionService.Decrypt(account.LastName, account.Salt);
                    summary.Id = account.Id;
                    summary.Name = $"{firstName} {lastName}";
                    summary.Total = 0;
                    summary.Read = 0;
                }

                summary.Total++;
                if (interactions.Any(x => x.Account.Id == account.Id))
                    summary.Read++;
            }
        }

        return Results.Ok(users.Select(x => x.Value).OrderBy(x => x.Name));
    }

    public class UserNoticeSummary
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Total { get; set; }
        public int Read { get; set; }
        public int Unread => Total - Read;
    }
}
