using Api.Database;
using Api.Database.Entities.Account;
using Api.Database.Entities.Hospital.Patients;
using Api.Database.Entities.Hospital.Patients.Labs;
using Api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Hospital.Patients.Labs.Blood;

public class UpdateBloodTest : IRequest<IResult>
{
    public int Id { get; set; }

    public string Comments { get; set; }

    public UpdateBloodTest WithId(int id)
    {
        Id = id;
        return this;
    }
}

public class UpdateBloodTestHandler : IRequestHandler<UpdateBloodTest, IResult>
{
    private readonly IDatabaseRepository _repository;
    private readonly IUserContext _userContext;

    public UpdateBloodTestHandler(IDatabaseRepository repository, IUserContext userContext)
    {
        _repository = repository;
        _userContext = userContext;
    }

    public async Task<IResult> Handle(UpdateBloodTest request, CancellationToken cancellationToken)
    {
        var test = await _repository.Get<PatientBloodTest>(request.Id, tracking: true,
            action: x => x.Include(y => y.Tester));
        if (test == null) return Results.BadRequest();

        var tester = await _repository.Get<Account>(_userContext.Id);
        if (tester == null) return Results.BadRequest();

        test.Tester = tester;
        test.Tested = DateTime.UtcNow;
        test.Comments = request.Comments;

        await _repository.SaveChangesAsync();

        return Results.NoContent();
    }
}
