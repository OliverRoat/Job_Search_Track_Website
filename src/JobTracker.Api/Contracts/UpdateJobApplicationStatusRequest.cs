using System.ComponentModel.DataAnnotations;
using JobTracker.Api.Models;

namespace JobTracker.Api.Contracts;

public class UpdateJobApplicationStatusRequest
{
    [EnumDataType(typeof(ApplicationStatus))]
    public ApplicationStatus Status { get; set; }
}
