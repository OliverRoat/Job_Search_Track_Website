using System.ComponentModel.DataAnnotations;
using JobTracker.Api.Models;

namespace JobTracker.Api.Contracts;

public class CreateJobApplicationRequest
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

    [EnumDataType(typeof(ApplicationStatus))]
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Applied;
}
