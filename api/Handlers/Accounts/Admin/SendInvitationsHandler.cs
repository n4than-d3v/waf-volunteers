using Api.Database;
using Api.Database.Entities.Rota;
using Api.Handlers.Accounts.Reset;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Api.Handlers.Accounts.Admin;

/// <summary>
/// Note: This will be removed after all teams have application access
/// </summary>
public class SendInvitations : IRequest<IResult>
{
    public DayOfWeek? Day { get; set; }
    public int? TimeId { get; set; }

    // or

    public string? Username { get; set; }
}

public class SendInvitationsHandler : IRequestHandler<SendInvitations, IResult>
{
    private readonly IMediator _mediator;
    private readonly IDatabaseRepository _repository;

    public SendInvitationsHandler(IMediator mediator, IDatabaseRepository repository)
    {
        _mediator = mediator;
        _repository = repository;
    }

    public async Task<IResult> Handle(SendInvitations request, CancellationToken cancellationToken)
    {
        var requestPasswordResetRequests = new List<RequestPasswordReset>();
        if (!string.IsNullOrWhiteSpace(request.Username))
        {
            // Roll out to individual
            requestPasswordResetRequests.Add(new RequestPasswordReset
            {
                Username = request.Username,
                IsAccountNewlyCreated = true
            });
        }
        else if (request.Day != null && request.TimeId != null)
        {
            // Roll out to team
            var regulars = await _repository.GetAll<RegularShift>(
                x => x.Day == request.Day && x.Time.Id == request.TimeId, tracking: false,
                action: x => x.Include(y => y.Account).Include(y => y.Time));
            foreach (var regular in regulars)
            {
                requestPasswordResetRequests.Add(new RequestPasswordReset
                {
                    Username = regular.Account.Username,
                    IsAccountNewlyCreated = true
                });
            }
        }
        else
        {
            return Results.BadRequest();
        }

        foreach (var requestPasswordResetRequest in requestPasswordResetRequests)
        {
            await _mediator.Send(requestPasswordResetRequest, cancellationToken);
        }

        return Results.NoContent();
    }
}
