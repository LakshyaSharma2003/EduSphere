using EduSphere.Backend.Domain;
using EduSphere.Backend.Infrastructure;
using EduSphere.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<EduSphereSeedStore>();
builder.Services.AddSingleton<AcademicOperationsService>();
builder.Services.AddSingleton<AuditTrailService>();
builder.Services.AddSingleton<CampusLogisticsService>();
builder.Services.AddSingleton<FinanceLedgerService>();
builder.Services.AddSingleton<SchedulingService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

var api = app.MapGroup("/api").WithTags("EduSphere");

api.MapGet("/health", () => Results.Ok(new
{
    service = "EduSphere Engine v20",
    status = "Operational",
    generatedAt = DateTimeOffset.UtcNow
}))
.WithName("HealthCheck")
.WithOpenApi();

api.MapGet("/dashboard", (EduSphereSeedStore store) =>
{
    var snapshot = store.Snapshot();
    return Results.Ok(new DashboardSnapshot(
        snapshot.Users.Count,
        snapshot.Courses.Sum(course => course.EnrolledCredits),
        snapshot.AttendanceRecords.Count(record => record.Percentage < 75),
        snapshot.FinanceLedgers.Sum(ledger => ledger.OutstandingBalance),
        snapshot.HostelBeds.Count(bed => bed.Status == BedStatus.Available),
        snapshot.AuditEvents.Count));
})
.WithName("GetDashboardSnapshot")
.WithOpenApi();

api.MapGet("/modules", (EduSphereSeedStore store) => Results.Ok(store.Snapshot().Modules))
    .WithName("GetModules")
    .WithOpenApi();

api.MapGet("/students/{studentId}/profile", (string studentId, EduSphereSeedStore store) =>
{
    var snapshot = store.Snapshot();
    var student = snapshot.Users.FirstOrDefault(user => user.Id.Equals(studentId, StringComparison.OrdinalIgnoreCase));
    return student is null ? Results.NotFound() : Results.Ok(student);
})
.WithName("GetStudentProfile")
.WithOpenApi();

api.MapPost("/courses/{courseCode}/bid", async (
    string courseCode,
    CourseBidRequest request,
    AcademicOperationsService academic,
    AuditTrailService audit) =>
{
    var result = await academic.PlaceCourseBidAsync(courseCode, request);
    audit.Record("CourseBid", request.StudentId, result.Message);
    return result.Accepted ? Results.Ok(result) : Results.BadRequest(result);
})
.WithName("PlaceCourseBid")
.WithOpenApi();

api.MapGet("/attendance/alerts", (AcademicOperationsService academic) =>
    Results.Ok(academic.GetAttendanceAlerts()))
    .WithName("GetAttendanceAlerts")
    .WithOpenApi();

api.MapPost("/scheduling/timetable/solve", async (SchedulingService scheduling) =>
    Results.Ok(await scheduling.GenerateTimetableAsync()))
    .WithName("SolveTimetable")
    .WithOpenApi();

api.MapGet("/finance/ledger/{studentId}", (string studentId, FinanceLedgerService finance) =>
{
    var ledger = finance.GetLedger(studentId);
    return ledger is null ? Results.NotFound() : Results.Ok(ledger);
})
.WithName("GetFinanceLedger")
.WithOpenApi();

api.MapPost("/hostels/beds/{bedId}/reserve", async (
    string bedId,
    BedReservationRequest request,
    CampusLogisticsService campus,
    AuditTrailService audit) =>
{
    var result = await campus.ReserveBedAsync(bedId, request.StudentId);
    audit.Record("HostelReservation", request.StudentId, result.Message);
    return result.Accepted ? Results.Ok(result) : Results.Conflict(result);
})
.WithName("ReserveHostelBed")
.WithOpenApi();

api.MapGet("/audit", (AuditTrailService audit) => Results.Ok(audit.Events))
    .WithName("GetAuditTrail")
    .WithOpenApi();

app.Run();
