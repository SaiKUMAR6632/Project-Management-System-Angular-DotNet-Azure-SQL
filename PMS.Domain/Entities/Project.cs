namespace PMS.Domain.Entities;

public class Project
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }

    public Guid CreatedByUserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
}
