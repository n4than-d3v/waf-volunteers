using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.HomeCare;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using WebPush;

namespace Api.Handlers.Hospital.HomeCare;

public class AddHomeCareMessage : IRequest<IResult>
{
    public int HomeCareRequestId { get; set; }
    public string Message { get; set; }

    public AddHomeCareMessage WithId(int id)
    {
        HomeCareRequestId = id;
        return this;
    }
}

public class HomeCareMessageHandler : IRequestHandler<AddHomeCareMessage, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;
    private readonly IEncryptionService _encryptionService;
    private readonly IPushService _pushService;

    public HomeCareMessageHandler(IDatabaseRepository repository, IUserContext userContext, IEncryptionService encryptionService, IPushService pushService)
    {
        _repository = repository;
        _userContext = userContext;
        _encryptionService = encryptionService;
        _pushService = pushService;
    }

    public async Task<IResult> Handle(AddHomeCareMessage request, CancellationToken cancellationToken)
    {
        var homeCareRequest = await _repository.Get<HomeCareRequest>(request.HomeCareRequestId, 
            action: x => x.Include(y => y.Patient).Include(y => y.Responder));
        if (homeCareRequest == null) return Results.BadRequest();

        var author = await _repository.Get<Account>(_userContext.Id);
        if (author == null) return Results.BadRequest();

        var homeCareMessage = new HomeCareMessage
        {
            Date = DateTime.UtcNow,
            Author = author,
            Patient = homeCareRequest.Patient,
            Message = request.Message
        };

        _repository.Create(homeCareMessage);
        await _repository.SaveChangesAsync();

        if (homeCareRequest.Responder != null && homeCareRequest.Responder.Id != author.Id)
        {
            var account = homeCareRequest.Responder;

            var subscription = _encryptionService.Decrypt(account.PushSubscription, account.Salt);
            if (!string.IsNullOrWhiteSpace(subscription))
            {
                var push = JsonConvert.DeserializeObject<PushSubscription>(subscription);
                await _pushService.Send(push, new PushNotification
                {
                    Title = "Home care message",
                    Body = $"You have received a new message regarding patient {homeCareRequest.Reference}"
                });
            }
        }

        return Results.Created();
    }
}
