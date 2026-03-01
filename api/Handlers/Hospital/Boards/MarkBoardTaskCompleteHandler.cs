using MediatR;

namespace Api.Handlers.Hospital.Boards;

public class MarkBoardTaskComplete : IRequest<IResult>
{
    public int PenId { get; set; }
    public int TaskId { get; set; }
}

public class MarkBoardTaskCompleteHandler : IRequestHandler<MarkBoardTaskComplete, IResult>
{
    public async Task<IResult> Handle(MarkBoardTaskComplete request, CancellationToken cancellationToken)
    {
        InMemoryBoardTasks.CompleteTask(request.PenId, request.TaskId);

        return Results.NoContent();
    }
}
