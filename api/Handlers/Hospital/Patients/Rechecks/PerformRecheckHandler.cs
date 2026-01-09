using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Exams;
using Api.Services;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Rechecks;

public class PerformRecheck : IRequest<IResult>
{
    public int RecheckId { get; set; }
    public string Comments { get; set; }
    public int? WeightValue { get; set; }
    public WeightUnit? WeightUnit { get; set; }

    public PerformRecheck WithId(int id)
    {
        RecheckId = id;
        return this;
    }
}

public class PerformRecheckHandler : IRequestHandler<PerformRecheck, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;

    public PerformRecheckHandler(IDatabaseRepository repository, IUserContext userContext)
    {
        _repository = repository;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(PerformRecheck request, CancellationToken cancellationToken)
    {
        var recheck = await _repository.Get<PatientRecheck>(request.RecheckId);
        if (recheck == null) return Results.BadRequest();

        var rechecker = await _repository.Get<Account>(_userContext.Id);
        if (rechecker == null) return Results.BadRequest();

        recheck.Rechecker = rechecker;
        recheck.Rechecked = DateTime.UtcNow;
        recheck.Comments = request.Comments;
        recheck.WeightValue = request.WeightValue;
        recheck.WeightUnit = request.WeightUnit;

        await _repository.SaveChangesAsync();
        return Results.Created();
    }
}
