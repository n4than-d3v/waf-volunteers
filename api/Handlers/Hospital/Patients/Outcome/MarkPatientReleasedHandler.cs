using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Outcome;
using Api.Services;
using MediatR;

namespace Api.Handlers.Hospital.Patients.Outcome;

public class MarkPatientReleased : IRequest<IResult>
{
    public int PatientId { get; set; }
    public int ReleaseTypeId { get; set; }

    public MarkPatientReleased WithId(int id)
    {
        PatientId = id;
        return this;
    }
}

public class MarkPatientReleasedHandler : IRequestHandler<MarkPatientReleased, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;
    private readonly IBeaconService _beaconService;

    public MarkPatientReleasedHandler(IDatabaseRepository repository, IUserContext userContext, IBeaconService beaconService)
    {
        _repository = repository;
        _userContext = userContext;
        _beaconService = beaconService;
    }

    public async Task<IResult> Handle(MarkPatientReleased request, CancellationToken cancellationToken)
    {
        var patient = await _repository.Get<Patient>(request.PatientId);
        if (patient == null) return Results.BadRequest();

        var dispositioner = await _repository.Get<Account>(_userContext.Id);
        if (dispositioner == null) return Results.BadRequest();

        var releaseType = await _repository.Get<ReleaseType>(request.ReleaseTypeId);
        if (releaseType == null) return Results.BadRequest();

        patient.DispositionReasons?.Clear();
        patient.Disposition = Disposition.Released;
        patient.Dispositioned = DateTime.UtcNow;
        patient.Dispositioner = dispositioner;
        patient.Status = PatientStatus.Dispositioned;
        patient.ReleaseType = releaseType;

        await _repository.SaveChangesAsync();

        if (patient.BeaconId != 0)
        {
            await _beaconService.UpdatePatientDispositionAsync(patient.BeaconId, BeaconService.BeaconDisposition.Released);
        }

        return Results.NoContent();
    }
}
