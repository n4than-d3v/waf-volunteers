using Api.Database;
using Api.Database.Entities;
using Api.Services;
using MediatR;

namespace Api.Handlers.Accounts;

public class RequestPasswordReset : IRequest<IResult>
{
    public string Username { get; set; }
}

public class RequestPasswordResetHandler : IRequestHandler<RequestPasswordReset, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;

    public RequestPasswordResetHandler(IDatabaseRepository repository, IEncryptionService encryptionService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(RequestPasswordReset request, CancellationToken cancellationToken)
    {
        var username = request.Username.ToLowerInvariant();
        var user = await _repository.Get<Account>(x => x.Username == username);
        if (user == null) return Results.BadRequest("Username does not exist");

        

        return Results.Ok();
    }
}
