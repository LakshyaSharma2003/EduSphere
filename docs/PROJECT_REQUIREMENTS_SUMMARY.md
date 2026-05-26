# EduSphere Engine v20 Requirements Summary

## Problem

Higher education institutions often operate with fragmented systems for academics, scheduling, finance, hostels, transport, libraries, research, placements, alumni, and health records. The specification asks for a unified digital operating system that removes data silos and supports high-volume concurrent usage.

## Requested Architecture

- Monorepo with backend and frontend under `src/`.
- Backend: C#/.NET 10, Clean Architecture, REST APIs, Swagger/OpenAPI, EF Core, PostgreSQL, Redis, background workers, transactional safety, and concurrency tokens.
- Frontend: Angular 20+, zoneless change detection, Angular Signals, modern control flow, route guards, HTTP interceptors, lazy/deferred views. The implementation uses Angular's stable `provideZonelessChangeDetection()` provider for Angular 20.2+.
- Testing: xUnit for backend registration logic and Jasmine/Jest for Angular signal/component behavior.

## Functional Domains

- Identity, governance, RBAC, MFA, provisioning, audit trail.
- Course bidding, enrollment, grading, attendance, alerts.
- Timetabling, exam seating, digital hall tickets.
- Fee invoices, payment webhooks, campus wallet.
- LMS uploads, plagiarism worker, assessment sandbox, engagement telemetry.
- Hostel allocation, transport GPS, library RFID, grievances.
- Placements, interview coordination, alumni mentorship.
- Medical EHR and pharmacy inventory.

## MVP Implemented In This Repository

The current implementation provides representative API contracts, services, seed data, and Angular dashboards for these domains. External infrastructure integrations are intentionally abstracted behind service boundaries so they can be replaced with EF Core, Redis, payment gateways, and device APIs.
