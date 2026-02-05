using PMS.Domain.Enums;

namespace PMS.Application.DTOs.Tasks;

public class ProjectTaskDto
{
    public Guid Id { get; set; }
    public Guid ProjectId { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public TaskStatusOfProject Status { get; set; } 
}
