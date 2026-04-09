using System.ComponentModel.DataAnnotations;
using JobTracker.Api.Models;

namespace JobTracker.Api.Contracts;

public class UpdateJobApplicationRequest
{
    [Required]
    [StringLength(200)]
    public string JobTitle { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string CompanyName { get; set; } = string.Empty;

    [Required]
    [StringLength(2048)]
    public string JobPostUrl { get; set; } = string.Empty;

    [Required]
    public DateOnly DateApplied { get; set; }

    [EnumDataType(typeof(ApplicationStatus))]
    public ApplicationStatus Status { get; set; }
}
