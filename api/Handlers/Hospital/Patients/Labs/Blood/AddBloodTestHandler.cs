using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Labs;
using Api.Services;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Labs.Blood;

public class AddBloodTest : IRequest<IResult>
{
    public int PatientId { get; set; }

    public string Comments { get; set; }
    public IFormFileCollection Files { get; set; }
}

public class AddBloodTestHandler : IRequestHandler<AddBloodTest, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;

    public AddBloodTestHandler(IDatabaseRepository repository, IUserContext userContext)
    {
        _repository = repository;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(AddBloodTest request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId);
        if (patient == null) return Results.BadRequest();

        var tester = await _repository.Get<Account>(_userContext.Id);
        if (tester == null) return Results.BadRequest();

        var bloodTest = new PatientBloodTest
        {
            Patient = patient,
            Tester = tester,
            Tested = DateTime.UtcNow,
            Comments = request.Comments
        };

        _repository.Create(bloodTest);
        await _repository.SaveChangesAsync();

        if (request.Files != null && request.Files.Count > 0)
        {
            foreach (var file in request.Files)
            {
                using var ms = new MemoryStream();
                await file.CopyToAsync(ms, cancellationToken);

                var bloodTestFile = new PatientBloodTestAttachment
                {
                    PatientBloodTest = bloodTest,
                    FileName = file.FileName,
                    ContentType = file.ContentType,
                    Data = ms.ToArray()
                };

                _repository.Create(bloodTestFile);
            }

            await _repository.SaveChangesAsync();
        }

        return Results.Created();
    }
}
