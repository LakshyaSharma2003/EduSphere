namespace EduSphere.Backend.Domain;

public enum SystemRole
{
    Student,
    Faculty,
    DepartmentHead,
    ExamController,
    FinancialAdmin,
    FacilityManager,
    SuperAdmin
}

public enum BedStatus
{
    Available,
    Reserved,
    Maintenance
}

public sealed record UserProfile(
    string Id,
    string FullName,
    string Email,
    SystemRole Role,
    string Department,
    decimal Cgpa,
    int ActiveBacklogs);

public sealed record Course(
    string Code,
    string Title,
    string FacultyId,
    int SeatLimit,
    int EnrolledCredits,
    IReadOnlyList<string> Prerequisites);

public sealed record AttendanceRecord(
    string StudentId,
    string CourseCode,
    decimal Percentage,
    DateTimeOffset LastUpdated);

public sealed record FinanceLedger(
    string StudentId,
    decimal TuitionDue,
    decimal HostelDue,
    decimal LibraryFine,
    decimal WalletBalance)
{
    public decimal OutstandingBalance => TuitionDue + HostelDue + LibraryFine;
}

public sealed record HostelBed(
    string Id,
    string Hostel,
    int Floor,
    string Room,
    BedStatus Status,
    string? ReservedBy);

public sealed record EduModule(
    string Name,
    string Category,
    string Status,
    string Description,
    IReadOnlyList<string> Capabilities);

public sealed record AuditEvent(
    string Id,
    string Action,
    string ActorId,
    string IpAddress,
    string PayloadSummary,
    DateTimeOffset Timestamp);

public sealed record DashboardSnapshot(
    int ActiveUsers,
    int EnrolledCredits,
    int AttendanceWarnings,
    decimal OutstandingDues,
    int AvailableBeds,
    int AuditEvents);

public sealed record CourseBidRequest(string StudentId, int CreditsRequested);

public sealed record OperationResult(bool Accepted, string Message, object? Data = null);

public sealed record BedReservationRequest(string StudentId);

public sealed record TimetableSlot(
    string CourseCode,
    string FacultyId,
    string Room,
    string Day,
    string StartsAt,
    string EndsAt);
