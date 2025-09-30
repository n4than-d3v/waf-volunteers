using Api.Database;
using Api.Database.Entities.Account;
using MediatR;

namespace Api.Handlers.Accounts.Admin;

public class UpdateRoles : IRequest<IResult>
{
    public int Id { get; private set; }

    public AccountRoles Roles { get; set; }

    public UpdateRoles WithId(int id)
    {
        Id = id;
        return this;
    }
}

public class UpdateRolesHandler : IRequestHandler<UpdateRoles, IResult>
{
    private readonly IDatabaseRepository _repository;

    public UpdateRolesHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(UpdateRoles request, CancellationToken cancellationToken)
    {
        var user = await _repository.Get<Account>(request.Id);
        if (user == null) return Results.BadRequest();

        user.UpdateRoles(request.Roles);
        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
