using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Notices;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Notices;

public class ListNotices : IRequest<IResult>
{
}

public class ListNoticesHandler : IRequestHandler<ListNotices, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;

    public ListNoticesHandler(IDatabaseRepository repository, IUserContext userContext)
    {
        _repository = repository;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(ListNotices request, CancellationToken cancellationToken)
    {
        var notices = await _repository.GetAll<Notice>(x => true, tracking: false);
        var interactions = await _repository.GetAll<NoticeInteraction>(
            x => x.Account.Id == _userContext.Id, tracking: false,
            action: x => x.Include(y => y.Account).Include(y => y.Notice));

        return Results.Ok(notices.OrderByDescending(x => x.Created).Select(x => new
        {
            x.Id,
            x.Title,
            x.Created,
            Read = interactions.Any(y => y.Notice.Id == x.Id)
        }).ToArray());
    }
}
