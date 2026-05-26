import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

export type EduRole = 'student' | 'teacher' | 'admin';
export type WorkspaceView = 'overview' | 'schedule' | 'courses' | 'people' | 'finance' | 'campus';

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

export interface Persona {
  id: string;
  name: string;
  role: EduRole;
  title: string;
  department: string;
  avatar: string;
  accent: string;
}

export interface ScheduleSlot {
  id: string;
  day: string;
  time: string;
  courseCode: string;
  courseTitle: string;
  room: string;
  faculty: string;
  status: 'Live' | 'Next' | 'Planned' | 'Review';
}

export interface CourseOption {
  code: string;
  title: string;
  credits: number;
  faculty: string;
  seatsLeft: number;
  progress: number;
  enrolled: boolean;
  category: string;
}

export interface CampusRequest {
  id: string;
  label: string;
  status: string;
  eta: string;
  owner: string;
}

export interface AdminSignal {
  label: string;
  value: string;
  tone: 'blue' | 'green' | 'amber' | 'red';
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

  readonly personas = signal<Persona[]>([
    {
      id: 'STU-1001',
      name: 'Aarav Mehta',
      role: 'student',
      title: 'B.Tech CSE, Semester 6',
      department: 'Computer Science',
      avatar: 'AM',
      accent: '#1f6feb'
    },
    {
      id: 'FAC-2001',
      name: 'Dr. Kavya Iyer',
      role: 'teacher',
      title: 'Professor and timetable owner',
      department: 'Computer Science',
      avatar: 'KI',
      accent: '#11835b'
    },
    {
      id: 'ADM-9001',
      name: 'Rohan Sen',
      role: 'admin',
      title: 'Super Admin',
      department: 'Governance',
      avatar: 'RS',
      accent: '#a76600'
    }
  ]);
  readonly activePersona = signal<Persona | null>(null);
  readonly activeView = signal<WorkspaceView>('overview');
  readonly toast = signal<string | null>(null);
  readonly dashboard = signal<DashboardSnapshot>(fallbackDashboard);
  readonly modules = signal<EduModule[]>([]);
  readonly attendanceAlerts = signal<AttendanceRecord[]>([]);
  readonly auditEvents = signal<AuditEvent[]>([]);
  readonly loading = signal(false);
  readonly apiStatus = signal<'live' | 'offline-demo'>('offline-demo');

  readonly totalRiskCount = computed(() =>
    this.dashboard().attendanceWarnings + Number(this.dashboard().outstandingDues > 0));

  readonly schedule = signal<ScheduleSlot[]>([
    {
      id: 'mon-0900',
      day: 'Mon',
      time: '09:00 - 10:30',
      courseCode: 'CS501',
      courseTitle: 'Distributed Systems',
      room: 'Lab-CS-3',
      faculty: 'Dr. Kavya Iyer',
      status: 'Live'
    },
    {
      id: 'mon-1130',
      day: 'Mon',
      time: '11:30 - 12:30',
      courseCode: 'CS544',
      courseTitle: 'Secure Cloud Platforms',
      room: 'Seminar-204',
      faculty: 'Dr. Kavya Iyer',
      status: 'Next'
    },
    {
      id: 'tue-1000',
      day: 'Tue',
      time: '10:00 - 11:30',
      courseCode: 'MA420',
      courseTitle: 'Optimization for Scheduling',
      room: 'Auditorium-1',
      faculty: 'Prof. Neeraj Shah',
      status: 'Planned'
    },
    {
      id: 'wed-1400',
      day: 'Wed',
      time: '14:00 - 15:30',
      courseCode: 'EL410',
      courseTitle: 'Embedded IoT Labs',
      room: 'IoT Studio',
      faculty: 'Dr. Meera Nair',
      status: 'Review'
    }
  ]);

  readonly courses = signal<CourseOption[]>([
    {
      code: 'CS501',
      title: 'Distributed Systems',
      credits: 4,
      faculty: 'Dr. Kavya Iyer',
      seatsLeft: 16,
      progress: 72,
      enrolled: true,
      category: 'Core'
    },
    {
      code: 'CS544',
      title: 'Secure Cloud Platforms',
      credits: 3,
      faculty: 'Dr. Kavya Iyer',
      seatsLeft: 3,
      progress: 46,
      enrolled: false,
      category: 'Elective'
    },
    {
      code: 'DS512',
      title: 'Academic Data Mining',
      credits: 3,
      faculty: 'Prof. Lina Bose',
      seatsLeft: 9,
      progress: 28,
      enrolled: false,
      category: 'Minor'
    },
    {
      code: 'HU220',
      title: 'Leadership Lab',
      credits: 2,
      faculty: 'Aditi Raman',
      seatsLeft: 21,
      progress: 88,
      enrolled: true,
      category: 'Open'
    }
  ]);

  readonly campusRequests = signal<CampusRequest[]>([
    { id: 'GR-119', label: 'Projector issue in Seminar-204', status: 'Assigned', eta: '2h 20m', owner: 'Facilities' },
    { id: 'LIB-044', label: 'RFID return reconciliation', status: 'Queued', eta: '45m', owner: 'Library' },
    { id: 'BUS-022', label: 'North route bus delayed', status: 'Live GPS', eta: '12m', owner: 'Transport' }
  ]);

  readonly adminSignals = computed<AdminSignal[]>(() => [
    { label: 'Concurrent users', value: `${this.dashboard().activeUsers}`, tone: 'blue' },
    { label: 'Credit load', value: `${this.dashboard().enrolledCredits}`, tone: 'green' },
    { label: 'SLA warnings', value: `${this.dashboard().attendanceWarnings}`, tone: 'amber' },
    { label: 'Dues exposure', value: `Rs ${this.dashboard().outstandingDues.toLocaleString('en-IN')}`, tone: 'red' }
  ]);

  readonly enrolledCourses = computed(() => this.courses().filter((course) => course.enrolled));
  readonly availableCourses = computed(() => this.courses().filter((course) => !course.enrolled));

  login(persona: Persona): void {
    this.activePersona.set(persona);
    this.activeView.set('overview');
    this.toast.set(`Welcome ${persona.name}. ${this.labelForRole(persona.role)} access enabled.`);
    window.setTimeout(() => this.toast.set(null), 2800);
  }

  logout(): void {
    this.activePersona.set(null);
    this.activeView.set('overview');
  }

  setView(view: WorkspaceView): void {
    this.activeView.set(view);
  }

  enroll(courseCode: string): void {
    this.courses.update((courses) =>
      courses.map((course) =>
        course.code === courseCode
          ? { ...course, enrolled: true, seatsLeft: Math.max(course.seatsLeft - 1, 0), progress: Math.min(course.progress + 18, 100) }
          : course));
    this.toast.set(`${courseCode} added to your course basket.`);
    window.setTimeout(() => this.toast.set(null), 2400);
  }

  drop(courseCode: string): void {
    this.courses.update((courses) =>
      courses.map((course) =>
        course.code === courseCode
          ? { ...course, enrolled: false, seatsLeft: course.seatsLeft + 1, progress: Math.max(course.progress - 12, 0) }
          : course));
    this.toast.set(`${courseCode} removed from your current load.`);
    window.setTimeout(() => this.toast.set(null), 2400);
  }

  markAttendance(slotId: string): void {
    const slot = this.schedule().find((item) => item.id === slotId);
    this.toast.set(slot ? `Attendance opened for ${slot.courseCode}.` : 'Attendance opened.');
    window.setTimeout(() => this.toast.set(null), 2400);
  }

  approveCampusRequest(requestId: string): void {
    this.campusRequests.update((requests) =>
      requests.map((request) =>
        request.id === requestId ? { ...request, status: 'Approved', eta: 'In progress' } : request));
    this.toast.set(`${requestId} approved and routed to the service team.`);
    window.setTimeout(() => this.toast.set(null), 2400);
  }

  private labelForRole(role: EduRole): string {
    return role === 'student' ? 'Student' : role === 'teacher' ? 'Teacher' : 'Administrator';
  }

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
