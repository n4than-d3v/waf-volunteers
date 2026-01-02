using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients.HomeCare;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.HomeCare;

public class HomeCareMessage : IRequest<IResult>
{
    public int HomeCareRequestId { get; set; }
    public string Message { get; set; }
}

public class HomeCareMessageHandler : IRequestHandler<HomeCareMessage, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;

    public HomeCareMessageHandler(IDatabaseRepository repository, IUserContext userContext)
    {
        _repository = repository;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(HomeCareMessage request, CancellationToken cancellationToken)
    {
        var homeCareRequest = await _repository.Get<HomeCareRequest>(request.HomeCareRequestId, action: x => x.Include(y => y.Patient));
        if (homeCareRequest == null) return Results.BadRequest();

        var author = await _repository.Get<Account>(_userContext.Id);
        if (author == null) return Results.BadRequest();

        var homeCareMessage = new Database.Entities.Hospital.Patients.HomeCare.HomeCareMessage
        {
            Date = DateTime.UtcNow,
            Author = author,
            Patient = homeCareRequest.Patient,
            Message = request.Message
        };

        _repository.Create(homeCareMessage);
        await _repository.SaveChangesAsync();
        return Results.Created();
    }
}
