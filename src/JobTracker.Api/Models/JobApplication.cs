namespace JobTracker.Api.Models;

public class JobApplication
{
    public int Id { get; set; }

    public required string JobTitle { get; set; }

    public required string CompanyName { get; set; }

    public required string JobPostUrl { get; set; }

    public ApplicationStatus Status { get; set; } = ApplicationStatus.Applied;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}
