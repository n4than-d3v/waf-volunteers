using Api.Database;
using Api.Database.Entities.Hospital.Patients.Exams;
using MediatR;

namespace Api.Handlers.Hospital.Exams;

public class GetMucousMembraneTextures : IRequest<IResult>
{
}

public class GetMucousMembraneTexturesHandler : IRequestHandler<GetMucousMembraneTextures, IResult>
{
    private readonly IDatabaseRepository _repository;

    public GetMucousMembraneTexturesHandler(IDatabaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IResult> Handle(GetMucousMembraneTextures request, CancellationToken cancellationToken)
    {
        var mucousMembraneTextures = await _repository.GetAll<MucousMembraneTexture>(x => true, tracking: false);
        return Results.Ok(mucousMembraneTextures);
    }
}
