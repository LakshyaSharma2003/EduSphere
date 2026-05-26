using EduSphere.Backend.Domain;
using EduSphere.Backend.Infrastructure;

namespace EduSphere.Backend.Services;

public sealed class CampusLogisticsService(EduSphereSeedStore store)
{
    public Task<OperationResult> ReserveBedAsync(string bedId, string studentId)
    {
        if (string.IsNullOrWhiteSpace(studentId))
        {
            return Task.FromResult(new OperationResult(false, "Student id is required."));
        }

        return Task.FromResult(store.TryReserveBed(bedId, studentId));
    }
}
