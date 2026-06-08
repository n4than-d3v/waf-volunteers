using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using Api.Handlers.Hospital.Patients;
using Api.Services;
using MediatR;

namespace Api.Handlers.Hospital.Boards;

public class GetTodayAdmissions : IRequest<IResult>
{
}

public class GetTodayAdmissionsHandler : IRequestHandler<GetTodayAdmissions, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;

    public GetTodayAdmissionsHandler(IDatabaseRepository repository, IEncryptionService encryptionService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(GetTodayAdmissions request, CancellationToken cancellationToken)
    {
        var startOfToday = DateTime.Today;
        startOfToday = DateTime.SpecifyKind(startOfToday, DateTimeKind.Utc);
        var patients = await _repository.GetAll<Patient>(x => startOfToday <= x.Admitted, tracking: false,
            action: x => x.IncludeAdmission().IncludeBasicDetails().IncludeOutcome());

        foreach (var patient in patients)
            patient.DecryptProperties(_encryptionService);

        return Results.Ok(patients.OrderByDescending(x => x.Admitted));
    }
}
