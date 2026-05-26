using EduSphere.Backend.Domain;

namespace EduSphere.Backend.Infrastructure;

public sealed class EduSphereSeedStore
{
    private readonly object _gate = new();
    private readonly List<UserProfile> _users =
    [
        new("STU-1001", "Aarav Mehta", "aarav@edusphere.local", SystemRole.Student, "Computer Science", 8.72m, 0),
        new("STU-1002", "Nisha Rao", "nisha@edusphere.local", SystemRole.Student, "Electronics", 7.91m, 1),
        new("FAC-2001", "Dr. Kavya Iyer", "kavya@edusphere.local", SystemRole.Faculty, "Computer Science", 0, 0),
        new("ADM-9001", "Rohan Sen", "rohan@edusphere.local", SystemRole.SuperAdmin, "Governance", 0, 0)
    ];

    private readonly List<Course> _courses =
    [
        new("CS501", "Distributed Systems", "FAC-2001", 60, 44, ["CS301"]),
        new("CS544", "Secure Cloud Platforms", "FAC-2001", 45, 42, ["CS401"]),
        new("EL410", "Embedded IoT Labs", "FAC-2002", 36, 34, ["EL201"])
    ];

    private readonly List<AttendanceRecord> _attendance =
    [
        new("STU-1001", "CS501", 82.5m, DateTimeOffset.UtcNow.AddHours(-2)),
        new("STU-1002", "CS544", 68.0m, DateTimeOffset.UtcNow.AddHours(-1))
    ];

    private readonly List<FinanceLedger> _ledgers =
    [
        new("STU-1001", 12000, 0, 150, 2400),
        new("STU-1002", 18000, 6000, 0, 900)
    ];

    private readonly List<HostelBed> _beds =
    [
        new("H-A-101-A", "Aryabhata", 1, "101", BedStatus.Reserved, "STU-1001"),
        new("H-A-101-B", "Aryabhata", 1, "101", BedStatus.Available, null),
        new("H-B-210-A", "Bhaskara", 2, "210", BedStatus.Maintenance, null)
    ];

    private readonly List<EduModule> _modules =
    [
        new("Identity Governance", "Governance & Access", "MVP", "RBAC, MFA-ready admin paths, audit trail, and CSV provisioning boundaries.", ["Seven role matrix", "Audit events", "Provisioning hooks"]),
        new("Academic Operations", "Academic", "MVP", "Course bidding, attendance warnings, grading ledger contracts.", ["Seat caps", "Prerequisite checks", "75 percent alerts"]),
        new("Reactive Scheduling", "Scheduling", "MVP", "Constraint-aware timetable and exam seating service surface.", ["Clash checks", "Room capacity", "Faculty availability"]),
        new("Campus Fintech", "Finance", "MVP", "Fee ledgers, payment webhook boundary, wallet balance display.", ["Invoice matrix", "Ledger flags", "Wallet tokens"]),
        new("Smart Campus", "Campus Logistics", "MVP", "Hostel bed reservation, transport, library, and grievance service boundaries.", ["Row-lock intent", "RFID registry", "SLA tickets"]),
        new("LMS+", "Learning", "Planned", "Assessment sandbox, streaming telemetry, and plagiarism worker contracts.", ["File workers", "Focus flags", "Engagement ticks"]),
        new("Career & Alumni", "Research & Career", "Planned", "Placement ATS, interview coordination, alumni mentorship.", ["CGPA filters", "Resume export", "Mentor chat"]),
        new("Health Infrastructure", "Medical", "Planned", "EHR-safe medical logs and pharmacy inventory alerts.", ["Clinic visits", "Emergency contacts", "Batch expiry"])
    ];

    private readonly List<AuditEvent> _auditEvents = [];

    public EduSphereSnapshot Snapshot()
    {
        lock (_gate)
        {
            return new EduSphereSnapshot(
                _users.ToList(),
                _courses.ToList(),
                _attendance.ToList(),
                _ledgers.ToList(),
                _beds.ToList(),
                _modules.ToList(),
                _auditEvents.ToList());
        }
    }

    public OperationResult TryEnroll(string courseCode, CourseBidRequest request)
    {
        lock (_gate)
        {
            var index = _courses.FindIndex(course => course.Code.Equals(courseCode, StringComparison.OrdinalIgnoreCase));
            if (index < 0)
            {
                return new OperationResult(false, $"Course {courseCode} was not found.");
            }

            var course = _courses[index];
            if (course.EnrolledCredits >= course.SeatLimit)
            {
                return new OperationResult(false, $"{course.Code} is already full.");
            }

            _courses[index] = course with { EnrolledCredits = course.EnrolledCredits + request.CreditsRequested };
            return new OperationResult(true, $"Bid accepted for {request.StudentId} in {course.Code}.", _courses[index]);
        }
    }

    public OperationResult TryReserveBed(string bedId, string studentId)
    {
        lock (_gate)
        {
            var index = _beds.FindIndex(bed => bed.Id.Equals(bedId, StringComparison.OrdinalIgnoreCase));
            if (index < 0)
            {
                return new OperationResult(false, $"Bed {bedId} was not found.");
            }

            var bed = _beds[index];
            if (bed.Status != BedStatus.Available)
            {
                return new OperationResult(false, $"{bed.Id} is not available.");
            }

            _beds[index] = bed with { Status = BedStatus.Reserved, ReservedBy = studentId };
            return new OperationResult(true, $"{bed.Id} reserved for {studentId}.", _beds[index]);
        }
    }

    public void AddAudit(AuditEvent auditEvent)
    {
        lock (_gate)
        {
            _auditEvents.Insert(0, auditEvent);
        }
    }
}

public sealed record EduSphereSnapshot(
    IReadOnlyList<UserProfile> Users,
    IReadOnlyList<Course> Courses,
    IReadOnlyList<AttendanceRecord> AttendanceRecords,
    IReadOnlyList<FinanceLedger> FinanceLedgers,
    IReadOnlyList<HostelBed> HostelBeds,
    IReadOnlyList<EduModule> Modules,
    IReadOnlyList<AuditEvent> AuditEvents);
