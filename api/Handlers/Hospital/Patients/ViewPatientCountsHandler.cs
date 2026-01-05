using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using MediatR;

namespace Api.Handlers.Hospital.Patients;

public class ViewPatientCounts : IRequest<IResult>
{
}

public class ViewPatientCountsHandler : IRequestHandler<ViewPatientCounts, IResult>
{
    private readonly IDatabaseRepository _repository;

    public ViewPatientCountsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(ViewPatientCounts request, CancellationToken cancellationToken)
    {
        var patients = await _repository.GetAll<Patient>(x => true, tracking: false);
        return Results.Ok(new
        {
            PendingInitialExam = patients.Count(x => x.Status == PatientStatus.PendingInitialExam),
            Inpatient = patients.Count(x => x.Status == PatientStatus.Inpatient),
            PendingHomeCare = patients.Count(x => x.Status == PatientStatus.PendingHomeCare),
            ReceivingHomeCare = patients.Count(x => x.Status == PatientStatus.ReceivingHomeCare),
            ReadyForRelease = patients.Count(x => x.Status == PatientStatus.ReadyForRelease),
            Dispositioned = patients.Count(x => x.Status == PatientStatus.Dispositioned)
        });
    }
}
