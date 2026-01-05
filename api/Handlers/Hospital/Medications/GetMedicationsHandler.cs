using Api.Database;
using Api.Database.Entities.Hospital.Patients.Medications;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Medications;

public class GetMedications : IRequest<IResult>
{
    public string Search { get; set; }
}

public class GetMedicationsHandler : IRequestHandler<GetMedications, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetMedicationsHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetMedications request, CancellationToken cancellationToken)
    {
        var showAll = string.IsNullOrWhiteSpace(request.Search);
        var search = (request.Search ?? string.Empty).ToUpper();
        var medications = await _repository.GetAll<Medication>(
            x => showAll || (x.Used && (
                x.VMNo.ToUpper().Contains(search) ||
                x.VMDProductNo.ToUpper().Contains(search) ||
                x.Name.ToUpper().Contains(search) ||
                x.ActiveSubstances.Any(y => y.Name.ToUpper().Contains(search))
            )),
            tracking: false,
            x => x
                .Include(y => y.ActiveSubstances)
                .Include(y => y.PharmaceuticalForm)
                .Include(y => y.TargetSpecies)
                .Include(y => y.TherapeuticGroup));
        return Results.Ok(medications.OrderBy(x => x.Name));
    }
}
