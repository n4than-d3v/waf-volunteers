using Api.Database;
using Api.Database.Entities.Notices;
using MediatR;

namespace Api.Handlers.Notices;

public class DeleteNotice : IRequest<IResult>
{
    public int NoticeId { get; set; }
}

public class DeleteNoticeHandler : IRequestHandler<DeleteNotice, IResult>
{
    private readonly IDatabaseRepository _repository;

    public DeleteNoticeHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(DeleteNotice request, CancellationToken cancellationToken)
    {
        var notice = await _repository.Get<Notice>(request.NoticeId);
        if (notice == null) return Results.BadRequest();

        _repository.Delete(notice);
        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
