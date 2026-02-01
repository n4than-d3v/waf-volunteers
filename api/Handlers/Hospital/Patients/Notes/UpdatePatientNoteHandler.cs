using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Exams;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Patients.Notes;

public class UpdatePatientNote : IRequest<IResult>
{
    public int Id { get; set; }

    public decimal? WeightValue { get; set; }
    public WeightUnit? WeightUnit { get; set; }
    public string Comments { get; set; }

    public UpdatePatientNote WithId(int id)
    {
        Id = id;
        return this;
    }
}

public class UpdatePatientNoteHandler : IRequestHandler<UpdatePatientNote, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;

    public UpdatePatientNoteHandler(IDatabaseRepository repository, IUserContext userContext)
    {
        _repository = repository;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(UpdatePatientNote request, CancellationToken cancellationToken)
    {
        var note = await _repository.Get<PatientNote>(request.Id, tracking: true,
            action: x => x.Include(y => y.Noter));
        if (note == null) return Results.BadRequest();

        var author = await _repository.Get<Account>(_userContext.Id);
        if (author == null) return Results.BadRequest();

        note.Noter = author;
        note.Noted = DateTime.UtcNow;
        note.WeightValue = request.WeightValue;
        note.WeightUnit = request.WeightUnit;
        note.Comments = request.Comments;

        await _repository.SaveChangesAsync();

        return Results.Created();
    }
}
