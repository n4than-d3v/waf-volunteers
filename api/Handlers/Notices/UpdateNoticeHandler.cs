using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Notices;
using MediatR;

namespace Api.Handlers.Notices;

public class UpdateNotice : IRequest<IResult>
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public AccountRoles Roles { get; set; }
    public IFormFileCollection Files { get; set; }

    public UpdateNotice WithId(int id)
    {
        Id = id;
        return this;
    }
}

public class UpdateNoticeHandler : IRequestHandler<UpdateNotice, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpdateNoticeHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpdateNotice request, CancellationToken cancellationToken)
    {
        var notice = await _repository.Get<Notice>(request.Id);
        if (notice == null) return Results.NotFound();

        notice.Title = request.Title;
        notice.Content = request.Content;
        notice.Roles = request.Roles;

        await _repository.SaveChangesAsync();

        if (request.Files != null && request.Files.Count > 0)
        {
            foreach (var file in request.Files)
            {
                using var ms = new MemoryStream();
                await file.CopyToAsync(ms, cancellationToken);

                var noticeFile = new NoticeAttachment
                {
                    Notice = notice,
                    FileName = file.FileName,
                    ContentType = file.ContentType,
                    Data = ms.ToArray()
                };

                _repository.Create(noticeFile);
            }

            await _repository.SaveChangesAsync();
        }

        return Results.NoContent();
    }
}
