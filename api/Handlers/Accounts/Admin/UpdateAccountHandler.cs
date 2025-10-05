﻿using Api.Database;
using Api.Database.Entities.Account;
using MediatR;

namespace Api.Handlers.Accounts.Admin;

public class UpdateAccount : IRequest<IResult>
{
    public int Id { get; private set; }

    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public UpdateAccountAddress Address { get; set; }
    public AccountRoles Roles { get; set; }
    public AccountStatus Status { get; set; }

    public class UpdateAccountAddress
    {
        public string LineOne { get; set; }
        public string LineTwo { get; set; }
        public string City { get; set; }
        public string County { get; set; }
        public string Postcode { get; set; }
    }

    public UpdateAccount WithId(int id)
    {
        Id = id;
        return this;
    }
}

public class UpdateAccountHandler : IRequestHandler<UpdateAccount, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IMediator _mediator;

    public UpdateAccountHandler(IDatabaseRepository repository, IMediator mediator)
    {
        _repository = repository;
        _mediator = mediator;
    }

    public async Task<IResult> Handle(UpdateAccount request, CancellationToken cancellationToken)
    {
        await _mediator.Send(new Info.UpdateAccountInfo
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Phone = request.Phone,
            Address = new Info.UpdateAccountInfo.UpdateAccountInfoAddress
            {
                LineOne = request.Address.LineOne,
                LineTwo = request.Address.LineTwo,
                City = request.Address.City,
                County = request.Address.County,
                Postcode = request.Address.Postcode,
            }
        }.WithId(request.Id), cancellationToken);

        var user = await _repository.Get<Account>(request.Id);
        if (user == null) return Results.BadRequest();

        user.UpdateRoles(request.Roles);
        user.UpdateStatus(request.Status);

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
