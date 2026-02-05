using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PMS.API.Controllers;
using PMS.Application.DTOs.Projects;
using PMS.Application.Interfaces;

[Authorize]
[ApiController]
[Route("api/projects")]
public class ProjectsController : BaseController
{
    private readonly IProjectService _service;

    public ProjectsController(IProjectService service)
    {
        _service = service;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ProjectDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var projects = await _service.GetAllAsync(UserId, cancellationToken);
        return Ok(projects);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ProjectDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromBody] CreateProjectDto dto,
        CancellationToken cancellationToken)
    {
        var project = await _service.CreateAsync(dto, UserId, cancellationToken);
        return CreatedAtAction(nameof(Get), new { id = project.Id }, project);
    }
}