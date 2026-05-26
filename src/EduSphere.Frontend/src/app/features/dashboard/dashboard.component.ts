import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';

import { EduSphereApiService } from '../../core/edusphere-api.service';

@Component({
  selector: 'edu-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  protected readonly api = inject(EduSphereApiService);
  protected readonly metrics = computed(() => {
    const snapshot = this.api.dashboard();
    return [
      { label: 'Active users', value: snapshot.activeUsers, tone: 'blue' },
      { label: 'Enrolled credits', value: snapshot.enrolledCredits, tone: 'green' },
      { label: 'Attendance warnings', value: snapshot.attendanceWarnings, tone: 'amber' },
      { label: 'Available hostel beds', value: snapshot.availableBeds, tone: 'blue' }
    ];
  });

  ngOnInit(): void {
    this.api.loadCommandCenter();
  }
}
