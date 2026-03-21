using Api.Configuration;
using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Exams;
using Api.Database.Entities.Hospital.Patients.HomeCare;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using WebPush;

namespace Api.Handlers.Hospital.HomeCare;

public class AddHomeCareMessage : IRequest<IResult>
{
    public int HomeCareRequestId { get; set; }
    public decimal? WeightValue { get; set; }
    public WeightUnit? WeightUnit { get; set; }
    public string Message { get; set; }
    public IFormFileCollection Files { get; set; }

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
    private readonly string _rootDirectory;

    public HomeCareMessageHandler(IDatabaseRepository repository, IUserContext userContext, IEncryptionService encryptionService, IPushService pushService, IOptions<FileSettings> fileSettings)
    {
        _repository = repository;
        _userContext = userContext;
        _encryptionService = encryptionService;
        _pushService = pushService;
        _rootDirectory = fileSettings.Value.RootDirectory;
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
            WeightValue = request.WeightValue,
            WeightUnit = request.WeightUnit,
            Message = request.Message
        };

        _repository.Create(homeCareMessage);
        await _repository.SaveChangesAsync();

        if (request.Files != null && request.Files.Count > 0)
        {
            var folder = Path.Combine(_rootDirectory, "homeCareMessages", homeCareMessage.Id.ToString());
            Directory.CreateDirectory(folder);

            foreach (var file in request.Files)
            {
                var filePath = Path.Combine(folder, file.FileName);
                await using var outStream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(outStream, cancellationToken);

                var homeCareMessageFile = new HomeCareMessageAttachment
                {
                    HomeCareMessage = homeCareMessage,
                    FileName = file.FileName,
                    ContentType = file.ContentType
                };

                _repository.Create(homeCareMessageFile);
            }

            await _repository.SaveChangesAsync();
        }

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
                    Body = $"You have received a new message regarding patient {homeCareRequest.Reference}",
                    Url = "/volunteer/home-care"
                }, account.Id);
            }
        }
        else
        {
            var rolesToNotify =
                AccountRoles.BEACON_VET |
                AccountRoles.BEACON_VET_NURSE |
                AccountRoles.APP_ADMIN;

            var accounts = await _repository.GetAll<Account>(x =>
                x.Status == AccountStatus.Active && (x.Roles & rolesToNotify) != 0);
            foreach (var account in accounts)
            {
                var subscription = _encryptionService.Decrypt(account.PushSubscription, account.Salt);
                if (!string.IsNullOrWhiteSpace(subscription))
                {
                    var push = JsonConvert.DeserializeObject<PushSubscription>(subscription);
                    await _pushService.Send(push, new PushNotification
                    {
                        Title = "Home care message",
                        Body = $"You have received a new message regarding patient {homeCareRequest.Reference}",
                        Url = "/vet/hospital"
                    }, account.Id);
                }
            }
        }

        await _pushService.RemoveInactiveSubscriptions();

        return Results.Created();
    }
}
