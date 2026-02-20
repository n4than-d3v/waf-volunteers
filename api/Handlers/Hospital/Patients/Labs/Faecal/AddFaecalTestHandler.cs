using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Labs;
using Api.Services;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Labs.Faecal;

public class AddFaecalTest : IRequest<IResult>
{
    public int PatientId { get; set; }

    public bool? Float { get; set; }
    public bool? Direct { get; set; }

    public string Comments { get; set; }

    public AddFaecalTest WithId(int id)
    {
        PatientId = id;
        return this;
    }
}

public class AddFaecalTestHandler : IRequestHandler<AddFaecalTest, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;

    public AddFaecalTestHandler(IDatabaseRepository repository, IUserContext userContext)
    {
        _repository = repository;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(AddFaecalTest request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId);
        if (patient == null) return Results.BadRequest();

        var tester = await _repository.Get<Account>(_userContext.Id);
        if (tester == null) return Results.BadRequest();

        patient.LastUpdatedDetails = DateTime.UtcNow;

        var faecalTest = new PatientFaecalTest
        {
            Patient = patient,
            Tester = tester,
            Tested = DateTime.UtcNow,
            Float = request.Float,
            Direct = request.Direct,
            Comments = request.Comments
        };

        _repository.Create(faecalTest);
        await _repository.SaveChangesAsync();

        return Results.Created();
    }
}
