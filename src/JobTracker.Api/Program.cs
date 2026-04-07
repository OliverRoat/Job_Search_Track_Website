using System.Text.Json.Serialization;
using JobTracker.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddOpenApi();
builder.Services.AddDbContext<JobTrackerDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("client", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();
var builtClientIndexPath = Path.Combine(app.Environment.WebRootPath, "index.html");
var hasBuiltClient = File.Exists(builtClientIndexPath);

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<JobTrackerDbContext>();
    dbContext.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

if (hasBuiltClient)
{
    app.UseDefaultFiles();
    app.UseStaticFiles();
}

app.UseCors("client");
app.UseAuthorization();
app.MapControllers();

if (hasBuiltClient)
{
    app.MapFallbackToFile("index.html");
}

app.Run();
