using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Patients;

public class ViewPatients : IRequest<IResult>
{
    public PatientStatus Status { get; set; }
}

public class ViewPatientsHandler : IRequestHandler<ViewPatients, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IEncryptionService _encryptionService;

    public ViewPatientsHandler(IDatabaseRepository repository, IEncryptionService encryptionService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
    }

    public async Task<IResult> Handle(ViewPatients request, CancellationToken cancellationToken)
    {
        var patients = await _repository.GetAll<Patient>(
            x => x.Status == request.Status, tracking: false,
            x => x
                .AsSplitQuery()
                .IncludeAdmission()
                .IncludeBasicDetails()
                .IncludeHusbandry());

        foreach (var patient in patients)
        {
            patient.DecryptProperties(_encryptionService);
        }

        return Results.Ok(patients.OrderByDescending(x => x.Admitted));
    }
}
