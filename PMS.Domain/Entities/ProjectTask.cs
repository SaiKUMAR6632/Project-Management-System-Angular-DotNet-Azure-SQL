using PMS.Domain.Enums;

namespace PMS.Domain.Entities;

public class ProjectTask
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    public TaskStatusOfProject Status { get; set; } = TaskStatusOfProject.Todo;

    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    // Auditing
    public Guid CreatedByUserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
