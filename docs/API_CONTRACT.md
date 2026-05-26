# API Contract

Base path: `/api`

## Operational

- `GET /health` - service status.
- `GET /dashboard` - aggregate dashboard snapshot.
- `GET /modules` - module catalog matching the project specification.
- `GET /audit` - immutable audit event feed.

## Academic

- `GET /students/{studentId}/profile` - student/faculty/admin profile.
- `POST /courses/{courseCode}/bid` - course bidding and seat-cap check.
- `GET /attendance/alerts` - attendance records below the 75 percent baseline.

## Scheduling

- `POST /scheduling/timetable/solve` - generates demo timetable slots through the scheduling service boundary.

## Finance

- `GET /finance/ledger/{studentId}` - tuition, hostel, library, and wallet balances.

## Campus Logistics

- `POST /hostels/beds/{bedId}/reserve` - row-lock-style bed reservation boundary.

## Planned Infrastructure Replacements

- Replace the seed store with EF Core PostgreSQL repositories.
- Add Redis-backed `IHostedService` queues.
- Add JWT validation, policy-based authorization, and TOTP MFA.
- Add payment provider webhook signature validation.
