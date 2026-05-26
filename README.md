# EduSphere Engine v20

EduSphere Engine v20 is a monorepo MVP for an autonomous, multi-tenant university ERP and real-time academic collaboration ecosystem. It is based on the project specification in `PRODUCTION PROJECT SPECIFICATIONProject TitleEduSphere Engine v20.docx`.

## What Is Included

- `src/EduSphere.Backend` - ASP.NET Core Web API source targeting the requested .NET 10 architecture.
- `src/EduSphere.Frontend` - Angular 20+ standalone, signal-first frontend source.
- Representative modules for governance, academics, scheduling, fintech, smart campus logistics, LMS, placements, alumni, and health.
- API endpoints for dashboard metrics, module catalog, course bidding, attendance alerts, timetable conflicts, finance ledger, hostel allocation, and audit events.
- Recruiter-friendly project documentation and setup notes.

## Repository Layout

```text
src/
  EduSphere.Backend/
    Domain/
    Infrastructure/
    Services/
  EduSphere.Frontend/
    src/app/
docs/
```

## Prerequisites

- .NET 10 SDK preview or newer stable SDK once .NET 10 is available.
- Node.js 22+
- npm 10+
- Angular CLI 20+

## Backend

```bash
cd src/EduSphere.Backend
dotnet restore
dotnet run
```

The API exposes Swagger in development and serves the MVP endpoints under `/api`.

## Frontend

```bash
cd src/EduSphere.Frontend
npm install
npm start
```

The Angular app expects the backend at `https://localhost:7221` or `http://localhost:5221`.

## Current Scope

This is a production-oriented MVP scaffold, not a finished mega-university deployment. It intentionally focuses on clean architecture, module boundaries, typed contracts, and visible workflows that can be expanded into EF Core persistence, Redis queues, MFA, payments, and real device integrations.

## Next Engineering Steps

1. Install .NET 10 SDK and Angular CLI 20 on the development machine.
2. Replace in-memory repositories with EF Core PostgreSQL repositories and migrations.
3. Add JWT auth, TOTP MFA, and role policy attributes.
4. Wire Redis queues for timetable, invoice, and plagiarism workers.
5. Add xUnit and Angular component tests around the implemented flows.
