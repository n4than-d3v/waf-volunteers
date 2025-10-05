﻿using Api.Database;
using Api.Database.Entities.Account;
using Api.Handlers.Accounts.Reset;
using Api.Services;
using MediatR;

namespace Api.Handlers.Accounts.Admin;

public class CreateAccount : IRequest<IResult>
{
    public string Username { get; set; }

    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public CreateAccountAddress Address { get; set; }

    public class CreateAccountAddress
    {
        public string LineOne { get; set; }
        public string LineTwo { get; set; }
        public string City { get; set; }
        public string County { get; set; }
        public string Postcode { get; set; }
    }

    public AccountRoles Roles { get; set; }
}

public class CreateAccountHandler : IRequestHandler<CreateAccount, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IMediator _mediator;

    public CreateAccountHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IMediator mediator)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _mediator = mediator;
    }

    public async Task<IResult> Handle(CreateAccount request, CancellationToken cancellationToken)
    {
        var username = request.Username.ToLowerInvariant();

        var existingUser = await _repository.Get<Account>(x => x.Username == username, tracking: false);
        if (existingUser != null) return Results.BadRequest("User already exists with that username");

        var salt = _encryptionService.GenerateSalt();

        var account = new Account(
            username,
            password: "-",
            AccountStatus.Active,
            request.Roles,
            _encryptionService.Encrypt(request.FirstName ?? string.Empty, salt),
            _encryptionService.Encrypt(request.LastName ?? string.Empty, salt),
            _encryptionService.Encrypt(request.Email ?? string.Empty, salt),
            _encryptionService.Encrypt(request.Phone ?? string.Empty, salt),
            _encryptionService.Encrypt(request.Address.LineOne ?? string.Empty, salt),
            _encryptionService.Encrypt(request.Address.LineTwo ?? string.Empty, salt),
            _encryptionService.Encrypt(request.Address.City ?? string.Empty, salt),
            _encryptionService.Encrypt(request.Address.County ?? string.Empty, salt),
            _encryptionService.Encrypt(request.Address.Postcode ?? string.Empty, salt),
            _encryptionService.Encrypt(string.Empty, salt),
            salt
        );

        _repository.Create(account);
        await _repository.SaveChangesAsync();

        await _mediator.Send(new RequestPasswordReset { Username = username }, cancellationToken);

        return Results.Created();
    }
}
