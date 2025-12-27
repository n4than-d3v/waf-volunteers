using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Notices;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Notices.Interaction;

public class OpenNotice : IRequest<IResult>
{
    public int NoticeId { get; set; }
}

public class OpenNoticeHandler : IRequestHandler<OpenNotice, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;

    public OpenNoticeHandler(IDatabaseRepository repository, IUserContext userContext)
    {
        _repository = repository;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(OpenNotice request, CancellationToken cancellationToken)
    {
        var notice = await _repository.Get<Notice>(request.NoticeId);
        if (notice == null) return Results.BadRequest();

        var account = await _repository.Get<Account>(_userContext.Id);
        if (account == null) return Results.BadRequest();

        var attachments = await _repository.GetAll<NoticeAttachment>(
            x => x.Notice.Id == notice.Id, tracking: false,
            action: x => x.Include(y => y.Notice));

        _repository.Create(new NoticeInteraction
        {
            Account = account,
            Notice = notice,
            Opened = DateTime.UtcNow,
            Closed = null
        });
        await _repository.SaveChangesAsync();

        return Results.Ok(new
        {
            notice.Id,
            notice.Title,
            notice.Content,
            notice.Created,
            notice.Roles,
            Attachments = attachments.Select(x => new
            {
                x.Id,
                x.FileName,
                x.ContentType
            }).ToArray()
        });
    }
}
