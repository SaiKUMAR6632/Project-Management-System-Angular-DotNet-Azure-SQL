using PMS.Application.DTOs.Projects;

namespace PMS.Application.Interfaces;

public interface IProjectService
{
    Task<IEnumerable<ProjectDto>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<ProjectDto> CreateAsync(
        CreateProjectDto dto,
        Guid userId,
        CancellationToken cancellationToken = default);
}
