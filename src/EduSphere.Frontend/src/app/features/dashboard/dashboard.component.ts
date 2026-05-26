import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';

import { EduSphereApiService } from '../../core/edusphere-api.service';

@Component({
  selector: 'edu-dashboard',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  protected readonly api = inject(EduSphereApiService);
  protected readonly persona = computed(() => this.api.activePersona());

  protected readonly quickStats = computed(() => {
    const role = this.persona()?.role;
    if (role === 'student') {
      return [
        { label: 'Today classes', value: `${this.api.schedule().filter((slot) => slot.day === 'Mon').length}`, tone: 'blue' },
        { label: 'Enrolled courses', value: `${this.api.enrolledCourses().length}`, tone: 'green' },
        { label: 'Attendance risk', value: `${this.api.attendanceAlerts().length}`, tone: 'amber' },
        { label: 'Wallet balance', value: 'Rs 2,400', tone: 'blue' }
      ];
    }

    if (role === 'teacher') {
      return [
        { label: 'Teaching hours', value: '14.5', tone: 'blue' },
        { label: 'Active sections', value: '4', tone: 'green' },
        { label: 'Alerts to review', value: `${this.api.attendanceAlerts().length}`, tone: 'amber' },
        { label: 'Assessments', value: '3', tone: 'red' }
      ];
    }

    return this.api.adminSignals();
  });

  ngOnInit(): void {
    this.api.loadCommandCenter();
    this.api.loadModules();
  }
}
