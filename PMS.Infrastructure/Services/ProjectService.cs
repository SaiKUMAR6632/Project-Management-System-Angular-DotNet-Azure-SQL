using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PMS.Application.DTOs.Projects;
using PMS.Application.Interfaces;
using PMS.Domain.Entities;
using PMS.Infrastructure.Persistence;

namespace PMS.Infrastructure.Services;

public class ProjectService : IProjectService
{
    private readonly AppDbContext _context;
    private readonly ILogger<ProjectService> _logger;

    public ProjectService(
        AppDbContext context,
        ILogger<ProjectService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<ProjectDto>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation(
            "Fetching projects for UserId {UserId}",
            userId);

        var projects = await _context.Projects
            .AsNoTracking()
            .Where(p => p.CreatedByUserId == userId)
            .Select(p => new ProjectDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description
            })
            .ToListAsync(cancellationToken);

        _logger.LogInformation(
            "Fetched {ProjectCount} projects for UserId {UserId}",
            projects.Count,
            userId);

        return projects;
    }

    public async Task<ProjectDto> CreateAsync(
        CreateProjectDto dto,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        using var scope = _logger.BeginScope(
            "ProjectCreation | UserId:{UserId}",
            userId);

        _logger.LogInformation("Starting project creation");

        await using var transaction =
            await _context.Database.BeginTransactionAsync(cancellationToken);

        try
        {
            var project = new Project
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Description = dto.Description,
                CreatedByUserId = userId,
                CreatedAt = DateTime.UtcNow // remove if not present
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            _logger.LogInformation(
                "Project {ProjectId} created successfully",
                project.Id);

            return new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error occurred while creating project");

            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
