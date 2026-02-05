using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PMS.Application.DTOs.Tasks;
using PMS.Application.Interfaces;
using PMS.Domain.Entities;
using PMS.Infrastructure.Persistence;

namespace PMS.Infrastructure.Services;

public class TaskService : ITaskService
{
    private readonly AppDbContext _context;
    private readonly ILogger<TaskService> _logger;

    public TaskService(
        AppDbContext context,
        ILogger<TaskService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<ProjectTaskDto> CreateAsync(
        Guid projectId,
        CreateTaskDto dto,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        using var scope = _logger.BeginScope(
            "TaskCreation | ProjectId:{ProjectId} | UserId:{UserId}",
            projectId,
            userId);

        _logger.LogInformation("Starting task creation");

        // 1️⃣ Verify project exists AND belongs to user
        var projectExists = await _context.Projects
            .AsNoTracking()
            .AnyAsync(p =>
                p.Id == projectId &&
                p.CreatedByUserId == userId,
                cancellationToken);

        if (!projectExists)
        {
            _logger.LogWarning(
                "Unauthorized task creation attempt or project not found");

            throw new InvalidOperationException(
                "Project not found or access denied");
        }

        // 2️⃣ Transaction boundary
        await using var transaction =
            await _context.Database.BeginTransactionAsync(cancellationToken);

        try
        {
            var task = new ProjectTask
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Description = dto.Description,
                Status = dto.Status,
                ProjectId = projectId,
                CreatedAt = DateTime.UtcNow // if column exists
            };

            _context.ProjectTasks.Add(task);
            await _context.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            _logger.LogInformation(
                "Task {TaskId} created successfully",
                task.Id);

            return new ProjectTaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                ProjectId = task.ProjectId
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error occurred while creating task");

            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
