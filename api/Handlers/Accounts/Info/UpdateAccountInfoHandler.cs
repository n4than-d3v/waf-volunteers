using Api.Database;
using Api.Database.Entities.Account;
using Api.Services;
using MediatR;

namespace Api.Handlers.Accounts.Info;

public class UpdateAccountInfo : IRequest<IResult>
{
    public int? Id { get; private set; }

    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public UpdateAccountInfoAddress Address { get; set; }
    public string[] Cars { get; set; }

    public class UpdateAccountInfoAddress
    {
        public string LineOne { get; set; }
        public string LineTwo { get; set; }
        public string City { get; set; }
        public string County { get; set; }
        public string Postcode { get; set; }
    }

    public UpdateAccountInfo WithId(int id)
    {
        Id = id;
        return this;
    }
}

public class UpdateAccountHandler : IRequestHandler<UpdateAccountInfo, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;
    private readonly IUserContext _userContext;

    public UpdateAccountHandler(IDatabaseRepository repository, IEncryptionService encryptionService, IUserContext userContext)
    {
        _repository = repository;
        _encryptionService = encryptionService;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(UpdateAccountInfo request, CancellationToken cancellationToken)
    {
        var user = await _repository.Get<Account>(request.Id ?? _userContext.Id);
        if (user == null) return Results.BadRequest();

        var firstName = _encryptionService.Encrypt(request.FirstName, user.Salt);
        var lastName = _encryptionService.Encrypt(request.LastName, user.Salt);
        var email = _encryptionService.Encrypt(request.Email, user.Salt);
        var phone = _encryptionService.Encrypt(request.Phone, user.Salt);
        var lineOne = _encryptionService.Encrypt(request.Address.LineOne, user.Salt);
        var lineTwo = _encryptionService.Encrypt(request.Address.LineTwo, user.Salt);
        var city = _encryptionService.Encrypt(request.Address.City, user.Salt);
        var county = _encryptionService.Encrypt(request.Address.County, user.Salt);
        var postcode = _encryptionService.Encrypt(request.Address.Postcode, user.Salt);
        var cars = (request.Cars ?? []).Select(car => _encryptionService.Encrypt(car, user.Salt)).ToArray();

        user.UpdatePersonalDetails(firstName, lastName, email, phone, lineOne, lineTwo, city, county, postcode, cars);

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
