using Api.Database;
using Api.Database.Entities.Hospital.Patients;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Patients;

public class ViewPatients : IRequest<IResult>
{
    public PatientStatus Status { get; set; }
    public string Search { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 50;
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
        request.Search ??= string.Empty;
        request.Search = request.Search.ToUpper();

        var patients = await _repository.GetAll<Patient>(
            x => true, tracking: false,
            x => x
                .Where(y =>
                    y.Status == request.Status &&
                    (
                        request.Search == "" ||
                        y.Reference.ToUpper().Contains(request.Search) ||
                        (y.Name != null && y.Name.ToUpper().Contains(request.Search)) ||
                        (y.SuspectedSpecies != null && y.SuspectedSpecies.Description.ToUpper().Contains(request.Search)) ||
                        (y.InitialLocation != null && y.InitialLocation.Description.ToUpper().Contains(request.Search)) ||
                        (y.Species != null && y.Species.Name.ToUpper().Contains(request.Search)) ||
                        (y.SpeciesVariant != null && y.SpeciesVariant.FriendlyName.ToUpper().Contains(request.Search)) ||
                        (y.Pen != null && y.Pen.Area != null && (y.Pen.Area.Code + "-" + y.Pen.Code).ToUpper().Contains(request.Search))
                    )
                )
                .OrderByDescending(x => x.Admitted)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .AsSplitQuery()
                .IncludeAdmission()
                .IncludeBasicDetails()
                .IncludeHusbandry()
                .IncludeHomeCare()
                .IncludeOutcome());

        foreach (var patient in patients)
        {
            patient.DecryptProperties(_encryptionService);
        }

        return Results.Ok(patients);
    }
}
