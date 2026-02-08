using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Outcome;
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

        var statuses = patients.GroupBy(x => x.Status).ToDictionary(x => x.Key, x => x.Count());

        statuses.TryGetValue(PatientStatus.PendingInitialExam, out var pendingInitialExam);
        statuses.TryGetValue(PatientStatus.Inpatient, out var inpatient);
        statuses.TryGetValue(PatientStatus.PendingHomeCare, out var pendingHomeCare);
        statuses.TryGetValue(PatientStatus.ReceivingHomeCare, out var receivingHomeCare);
        statuses.TryGetValue(PatientStatus.ReadyForRelease, out var readyForRelease);
        statuses.TryGetValue(PatientStatus.Dispositioned, out var dispositioned);

        return Results.Ok(new
        {
            pendingInitialExam,
            inpatient,
            pendingHomeCare,
            receivingHomeCare,
            readyForRelease,
            dispositioned
        });
    }
}
