using JobTracker.Api.Contracts;
using JobTracker.Api.Data;
using JobTracker.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Api.Controllers;

[ApiController]
[Route("api/job-applications")]
public class JobApplicationsController(JobTrackerDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<JobApplication>>> GetAll()
    {
        var applications = await dbContext.JobApplications
            .OrderByDescending(application => application.DateApplied)
            .ThenByDescending(application => application.CreatedAtUtc)
            .ToListAsync();

        return Ok(applications);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<JobApplication>> GetById(int id)
    {
        var application = await dbContext.JobApplications.FindAsync(id);

        return application is null ? NotFound() : Ok(application);
    }

    [HttpPost]
    public async Task<ActionResult<JobApplication>> Create(CreateJobApplicationRequest request)
    {
        if (!Uri.TryCreate(request.JobPostUrl, UriKind.Absolute, out _))
        {
            ModelState.AddModelError(nameof(request.JobPostUrl), "A valid absolute URL is required.");
            return ValidationProblem(ModelState);
        }

        var application = new JobApplication
        {
            JobTitle = request.JobTitle.Trim(),
            CompanyName = request.CompanyName.Trim(),
            JobPostUrl = request.JobPostUrl.Trim(),
            DateApplied = request.DateApplied,
            Status = request.Status,
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        dbContext.JobApplications.Add(application);
        await dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = application.Id }, application);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<JobApplication>> Update(int id, UpdateJobApplicationRequest request)
    {
        if (!Uri.TryCreate(request.JobPostUrl, UriKind.Absolute, out _))
        {
            ModelState.AddModelError(nameof(request.JobPostUrl), "A valid absolute URL is required.");
            return ValidationProblem(ModelState);
        }

        var application = await dbContext.JobApplications.FindAsync(id);
        if (application is null)
        {
            return NotFound();
        }

        application.JobTitle = request.JobTitle.Trim();
        application.CompanyName = request.CompanyName.Trim();
        application.JobPostUrl = request.JobPostUrl.Trim();
        application.DateApplied = request.DateApplied;
        application.Status = request.Status;
        application.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync();

        return Ok(application);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult<JobApplication>> UpdateStatus(int id, UpdateJobApplicationStatusRequest request)
    {
        var application = await dbContext.JobApplications.FindAsync(id);
        if (application is null)
        {
            return NotFound();
        }

        application.Status = request.Status;
        application.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync();

        return Ok(application);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var application = await dbContext.JobApplications.FindAsync(id);
        if (application is null)
        {
            return NotFound();
        }

        dbContext.JobApplications.Remove(application);
        await dbContext.SaveChangesAsync();

        return NoContent();
    }
}
