using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PMS.Application.DTOs.Tasks;
using PMS.Application.Interfaces;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/projects/{projectId:guid}/tasks")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _service;

    public TasksController(ITaskService service)
    {
        _service = service;
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Create(
        Guid projectId,
        [FromBody] CreateTaskDto dto,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var task = await _service.CreateAsync(
            projectId,
            dto,
            userId,
            cancellationToken);

        return CreatedAtAction(
            nameof(Create),
            new { projectId, taskId = task.Id },
            task);
    }
}
