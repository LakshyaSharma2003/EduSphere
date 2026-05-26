# Roadmap

## Phase 1 - Current MVP

- Monorepo source structure.
- ASP.NET Core Web API with typed contracts and Swagger-ready endpoints.
- Angular signal-driven command center and module matrix.
- Seed data representing major ERP domains.
- Backend and frontend test scaffolds.

## Phase 2 - Persistence And Security

- PostgreSQL schema with EF Core migrations.
- Identity users, role policies, JWT access tokens, refresh rotation.
- MFA enrollment for administrative and financial routes.
- Cryptographic audit event hashing.

## Phase 3 - Enterprise Workflows

- Course bidding with database transactions and concurrency tokens.
- Timetable solver worker backed by Redis queues.
- Payment webhooks for Stripe/Razorpay.
- Hostel and library reservation with row-level locking.

## Phase 4 - Real-Time Campus

- SignalR notification hub.
- Transport GPS stream ingestion.
- LMS engagement telemetry.
- Alumni mentoring chat and placement interview reminders.
