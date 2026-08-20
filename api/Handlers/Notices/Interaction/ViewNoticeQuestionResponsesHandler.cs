using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Notices;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Notices.Interaction;

public class ViewNoticeQuestionResponses : IRequest<IResult>
{
    public int NoticeId { get; set; }
}

public class ViewNoticeQuestionResponsesHandler : IRequestHandler<ViewNoticeQuestionResponses, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;

    public ViewNoticeQuestionResponsesHandler(IDatabaseRepository repository, IEncryptionService encryptionService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(ViewNoticeQuestionResponses request, CancellationToken cancellationToken)
    {
        var notice = await _repository.Get<Notice>(request.NoticeId, tracking: false);
        if (notice == null) return Results.BadRequest();

        var questions = await _repository.GetAll<NoticeQuestion>(x => x.Notice.Id == request.NoticeId, false,
            x => x.Include(y => y.Notice).Include(y => y.Responses).ThenInclude(y => y.Responder));

        var accounts = await _repository.GetAll<Account>(x => x.Status == AccountStatus.Active, tracking: false);

        questions = [.. questions.OrderBy(q => q.Id)];

        var users = new List<UserNotice>();

        foreach (var account in accounts)
        {
            if (!notice.ShouldShow(account)) continue;

            var firstName = _encryptionService.Decrypt(account.FirstName, account.Salt);
            var lastName = _encryptionService.Decrypt(account.LastName, account.Salt);
            users.Add(new UserNotice
            {
                Name = $"{firstName} {lastName}",
                Answers = questions
                    .Select(q => new
                    {
                        q.Id,
                        Answers = q.Responses.FirstOrDefault(r => r.Responder.Id == account.Id)?.Answers ?? []
                    }).ToDictionary(x => x.Id, x => x.Answers)
            });
        }

        return Results.Ok(new
        {
            questions = questions.Select(q => new QuestionResponses
            {
                Id = q.Id,
                Title = q.Title,
                Answers = q.Responses
                    .SelectMany(r => r.Answers)
                    .GroupBy(r => r)
                    .ToDictionary(r => r.Key, r => r.Count())
            }),
            users = users.OrderBy(x => x.Name)
        });
    }

    public class QuestionResponses
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public Dictionary<string, int> Answers { get; set; }
    }

    public class UserNotice
    {
        public string Name { get; set; }
        public Dictionary<int, string[]> Answers { get; set; }
    }
}
