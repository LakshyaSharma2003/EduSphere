using EduSphere.Backend.Domain;
using EduSphere.Backend.Infrastructure;

namespace EduSphere.Backend.Services;

public sealed class SchedulingService(EduSphereSeedStore store)
{
    public Task<IReadOnlyList<TimetableSlot>> GenerateTimetableAsync()
    {
        var rooms = new[] { "Auditorium-1", "Lab-CS-3", "Seminar-204" };
        var days = new[] { "Monday", "Tuesday", "Wednesday" };

        var slots = store.Snapshot().Courses.Select((course, index) =>
            new TimetableSlot(
                course.Code,
                course.FacultyId,
                rooms[index % rooms.Length],
                days[index % days.Length],
                $"{9 + index:00}:00",
                $"{10 + index:00}:30")).ToList();

        return Task.FromResult<IReadOnlyList<TimetableSlot>>(slots);
    }
}
