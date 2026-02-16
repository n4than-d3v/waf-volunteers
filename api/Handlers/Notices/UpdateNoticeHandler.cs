using Api.Configuration;
using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Notices;
using MediatR;
using Microsoft.Extensions.Options;

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
    private readonly string _rootDirectory;

    public UpdateNoticeHandler(IDatabaseRepository repository, IOptions<FileSettings> fileSettings)
    {
        _repository = repository;
        _rootDirectory = fileSettings.Value.RootDirectory;
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
            var folder = Path.Combine(_rootDirectory, "notices", notice.Id.ToString());
            Directory.CreateDirectory(folder);

            foreach (var file in request.Files)
            {
                var filePath = Path.Combine(folder, file.FileName);
                await using var outStream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(outStream, cancellationToken);

                var noticeFile = new NoticeAttachment
                {
                    Notice = notice,
                    FileName = file.FileName,
                    ContentType = file.ContentType
                };

                _repository.Create(noticeFile);
            }

            await _repository.SaveChangesAsync();
        }

        return Results.NoContent();
    }
}
