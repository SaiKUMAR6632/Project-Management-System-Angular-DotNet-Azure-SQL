using PMS.Application.DTOs.Tasks;

namespace PMS.Application.Interfaces;

public interface ITaskService
{
    Task<ProjectTaskDto> CreateAsync(
        Guid projectId,
        CreateTaskDto dto,
        Guid userId,
        CancellationToken cancellationToken = default);
}
