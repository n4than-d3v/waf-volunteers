using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Labs;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Patients.Labs.Faecal;

public class UpdateFaecalTest : IRequest<IResult>
{
    public int Id { get; set; }

    public bool? Float { get; set; }
    public bool? Direct { get; set; }

    public string Comments { get; set; }

    public UpdateFaecalTest WithId(int id)
    {
        Id = id;
        return this;
    }
}

public class UpdateFaecalTestHandler : IRequestHandler<UpdateFaecalTest, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;

    public UpdateFaecalTestHandler(IDatabaseRepository repository, IUserContext userContext)
    {
        _repository = repository;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(UpdateFaecalTest request, CancellationToken cancellationToken)
    {
        var test = await _repository.Get<PatientFaecalTest>(request.Id, tracking: true,
            action: x => x.Include(y => y.Tester));
        if (test == null) return Results.BadRequest();

        var tester = await _repository.Get<Account>(_userContext.Id);
        if (tester == null) return Results.BadRequest();

        test.Tester = tester;
        test.Tested = DateTime.UtcNow;
        test.Float = request.Float;
        test.Direct = request.Direct;
        test.Comments = request.Comments;

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
