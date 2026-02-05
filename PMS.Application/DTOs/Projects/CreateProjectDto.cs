namespace PMS.Application.DTOs.Projects;

public class CreateProjectDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
}
