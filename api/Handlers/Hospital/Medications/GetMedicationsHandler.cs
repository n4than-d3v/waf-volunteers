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
            x => x.Deleted == false,
            tracking: false,
            x => x
                .Include(y => y.Concentrations)
                    .ThenInclude(y => y.SpeciesDoses)
                        .ThenInclude(m => m.Species)
                .Include(y => y.Concentrations)
                    .ThenInclude(y => y.SpeciesDoses)
                        .ThenInclude(y => y.AdministrationMethod));

        foreach (var medication in medications)
        {
            medication.Concentrations = [.. medication.Concentrations.Where(x => x.Deleted == false)];
            foreach (var concentration in medication.Concentrations)
            {
                concentration.SpeciesDoses = [.. concentration.SpeciesDoses.Where(x => x.Deleted == false)];
            }
        }

        return Results.Ok(medications.OrderBy(x => x.ActiveSubstance));
    }
}
