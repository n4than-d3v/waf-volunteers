using Api.Database;
using Api.Database.Entities.Account;
using MediatR;

namespace Api.Handlers.Accounts.Admin;

public class UpdateStatus : IRequest<IResult>
{
    public int Id { get; private set; }

    public AccountStatus Status { get; set; }

    public UpdateStatus WithId(int id)
    {
        Id = id;
        return this;
    }
}

public class UpdateStatusHandler : IRequestHandler<UpdateStatus, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpdateStatusHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpdateStatus request, CancellationToken cancellationToken)
    {
        var user = await _repository.Get<Account>(request.Id);
        if (user == null) return Results.BadRequest();

        user.UpdateStatus(request.Status);
        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
