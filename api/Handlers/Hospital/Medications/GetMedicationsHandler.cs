using Api.Database;
using Api.Database.Entities.Hospital.Patients.Medications;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Medications;

public class GetMedications : IRequest<IResult>
{
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
        var medications = await _repository.GetAll<Medication>(
            x => true,
            tracking: false,
            x => x
                .Include(y => y.Concentrations)
                    .ThenInclude(y => y.SpeciesDoses)
                        .ThenInclude(m => m.Species)
                .Include(y => y.Concentrations)
                    .ThenInclude(y => y.SpeciesDoses)
                        .ThenInclude(y => y.AdministrationMethod));
        return Results.Ok(medications.OrderBy(x => x.ActiveSubstance));
    }
}
