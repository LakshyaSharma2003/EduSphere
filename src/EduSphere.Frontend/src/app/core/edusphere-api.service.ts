import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

export interface DashboardSnapshot {
  activeUsers: number;
  enrolledCredits: number;
  attendanceWarnings: number;
  outstandingDues: number;
  availableBeds: number;
  auditEvents: number;
}

export interface EduModule {
  name: string;
  category: string;
  status: string;
  description: string;
  capabilities: string[];
}

export interface AttendanceRecord {
  studentId: string;
  courseCode: string;
  percentage: number;
  lastUpdated: string;
}

export interface AuditEvent {
  id: string;
  action: string;
  actorId: string;
  ipAddress: string;
  payloadSummary: string;
  timestamp: string;
}

const fallbackDashboard: DashboardSnapshot = {
  activeUsers: 4,
  enrolledCredits: 120,
  attendanceWarnings: 1,
  outstandingDues: 36150,
  availableBeds: 1,
  auditEvents: 0
};

@Injectable({ providedIn: 'root' })
export class EduSphereApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = 'http://localhost:5221/api';

  readonly dashboard = signal<DashboardSnapshot>(fallbackDashboard);
  readonly modules = signal<EduModule[]>([]);
  readonly attendanceAlerts = signal<AttendanceRecord[]>([]);
  readonly auditEvents = signal<AuditEvent[]>([]);
  readonly loading = signal(false);
  readonly apiStatus = signal<'live' | 'offline-demo'>('offline-demo');

  readonly totalRiskCount = computed(() =>
    this.dashboard().attendanceWarnings + Number(this.dashboard().outstandingDues > 0));

  loadCommandCenter(): void {
    this.loading.set(true);
    this.http.get<DashboardSnapshot>(`${this.apiBase}/dashboard`).subscribe({
      next: (snapshot) => {
        this.dashboard.set(snapshot);
        this.apiStatus.set('live');
      },
      error: () => this.apiStatus.set('offline-demo'),
      complete: () => this.loading.set(false)
    });

    this.http.get<AttendanceRecord[]>(`${this.apiBase}/attendance/alerts`).subscribe({
      next: (alerts) => this.attendanceAlerts.set(alerts),
      error: () => this.attendanceAlerts.set([
        { studentId: 'STU-1002', courseCode: 'CS544', percentage: 68, lastUpdated: new Date().toISOString() }
      ])
    });

    this.http.get<AuditEvent[]>(`${this.apiBase}/audit`).subscribe({
      next: (events) => this.auditEvents.set(events),
      error: () => this.auditEvents.set([])
    });
  }

  loadModules(): void {
    this.http.get<EduModule[]>(`${this.apiBase}/modules`).subscribe({
      next: (modules) => {
        this.modules.set(modules);
        this.apiStatus.set('live');
      },
      error: () => this.modules.set(this.fallbackModules())
    });
  }

  private fallbackModules(): EduModule[] {
    return [
      {
        name: 'Identity Governance',
        category: 'Governance & Access',
        status: 'MVP',
        description: 'RBAC, MFA-ready admin paths, provisioning hooks, and cryptographic audit events.',
        capabilities: ['Seven role matrix', 'JWT interceptor', 'Audit trail']
      },
      {
        name: 'Academic Operations',
        category: 'Academic',
        status: 'MVP',
        description: 'Course bidding, hard seat caps, attendance warnings, and grading ledger contracts.',
        capabilities: ['Course bids', 'Prerequisite checks', 'SLA alerts']
      },
      {
        name: 'Campus Fintech',
        category: 'Finance',
        status: 'MVP',
        description: 'Credit-hour invoices, ledger reconciliation boundaries, and wallet display.',
        capabilities: ['Invoice matrix', 'Webhook-ready routes', 'Wallet balance']
      },
      {
        name: 'Smart Campus',
        category: 'Campus Logistics',
        status: 'MVP',
        description: 'Hostel beds, library registry, transport tracking, and grievance SLA hooks.',
        capabilities: ['Bed reservation', 'RFID fines', 'Route telemetry']
      }
    ];
  }
}
