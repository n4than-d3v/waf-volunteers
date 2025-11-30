using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Notices;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Notices.Interaction;

public class CloseNotice : IRequest<IResult>
{
    public int NoticeId { get; set; }
}

public class CloseNoticeHandler : IRequestHandler<CloseNotice, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;

    public CloseNoticeHandler(IDatabaseRepository repository, IUserContext userContext)
    {
        _repository = repository;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(CloseNotice request, CancellationToken cancellationToken)
    {
        var notice = await _repository.Get<Notice>(request.NoticeId);
        if (notice == null) return Results.BadRequest();

        var account = await _repository.Get<Account>(_userContext.Id);
        if (account == null) return Results.BadRequest();

        var interactions = await _repository.GetAll<NoticeInteraction>(
            x => x.Notice.Id == notice.Id && x.Account.Id == account.Id && x.Closed == null,
            action: x => x.Include(y => y.Notice).Include(y => y.Account));

        foreach (var interaction in interactions)
        {
            interaction.Closed = DateTime.UtcNow;
        }

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
