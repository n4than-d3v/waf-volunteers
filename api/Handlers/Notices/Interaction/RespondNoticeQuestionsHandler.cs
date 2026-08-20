using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Notices;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Notices.Interaction;

public class RespondNoticeQuestions : IRequest<IResult>
{
    public List<QuestionResponse> Responses { get; set; }

    public class QuestionResponse
    {
        public int QuestionId { get; set; }
        public string[] Answers { get; set; }
    }
}

public class RespondNoticeQuestionsHandler : IRequestHandler<RespondNoticeQuestions, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;

    public RespondNoticeQuestionsHandler(IDatabaseRepository repository, IUserContext userContext)
    {
        _repository = repository;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(RespondNoticeQuestions request, CancellationToken cancellationToken)
    {
        foreach (var response in request.Responses)
        {
            var question = await _repository.Get<NoticeQuestion>(response.QuestionId, true,
                x => x.Include(y => y.Responses).ThenInclude(y => y.Responder));
            if (question == null) return Results.BadRequest();

            var account = await _repository.Get<Account>(_userContext.Id);
            if (account == null) return Results.BadRequest();

            var existing = question.Responses.FirstOrDefault(r => r.Responder.Id == account.Id);

            if (existing != null)
            {
                existing.Responded = DateTime.UtcNow;
                existing.Answers = response.Answers;
            }
            else
            {
                _repository.Create(new NoticeQuestionResponse
                {
                    Question = question,
                    Responder = account,
                    Responded = DateTime.UtcNow,
                    Answers = response.Answers
                });
            }
        }

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
