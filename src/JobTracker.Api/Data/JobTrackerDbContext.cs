using JobTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Api.Data;

public class JobTrackerDbContext(DbContextOptions<JobTrackerDbContext> options) : DbContext(options)
{
    public DbSet<JobApplication> JobApplications => Set<JobApplication>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<JobApplication>(entity =>
        {
            entity.Property(application => application.JobTitle)
                .HasMaxLength(200);

            entity.Property(application => application.CompanyName)
                .HasMaxLength(200);

            entity.Property(application => application.JobPostUrl)
                .HasMaxLength(2048);

            entity.Property(application => application.DateApplied);

            entity.Property(application => application.Status)
                .HasConversion<string>();
        });
    }
}
