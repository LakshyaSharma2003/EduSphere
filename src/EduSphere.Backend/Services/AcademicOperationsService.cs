using EduSphere.Backend.Domain;
using EduSphere.Backend.Infrastructure;

namespace EduSphere.Backend.Services;

public sealed class AcademicOperationsService(EduSphereSeedStore store)
{
    public Task<OperationResult> PlaceCourseBidAsync(string courseCode, CourseBidRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.StudentId))
        {
            return Task.FromResult(new OperationResult(false, "Student id is required."));
        }

        if (request.CreditsRequested <= 0)
        {
            return Task.FromResult(new OperationResult(false, "Credits requested must be greater than zero."));
        }

        return Task.FromResult(store.TryEnroll(courseCode, request));
    }

    public IReadOnlyList<AttendanceRecord> GetAttendanceAlerts()
    {
        return store.Snapshot()
            .AttendanceRecords
            .Where(record => record.Percentage < 75)
            .OrderBy(record => record.Percentage)
            .ToList();
    }
}
