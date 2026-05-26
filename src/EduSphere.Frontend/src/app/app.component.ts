import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { EduSphereApiService, WorkspaceView } from './core/edusphere-api.service';

@Component({
  selector: 'edu-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected readonly api = inject(EduSphereApiService);
  protected readonly tenant = 'Demo Autonomous University';
  protected readonly headerLabel = computed(() => {
    const persona = this.api.activePersona();
    return persona ? `${this.tenant} / ${persona.title}` : this.tenant;
  });

  protected readonly navigation = computed<Array<{ label: string; view: WorkspaceView }>>(() => {
    const role = this.api.activePersona()?.role;
    if (role === 'student') {
      return [
        { label: 'Home', view: 'overview' },
        { label: 'My Timetable', view: 'schedule' },
        { label: 'Course Bidding', view: 'courses' },
        { label: 'Campus Life', view: 'campus' },
        { label: 'Fees', view: 'finance' }
      ];
    }

    if (role === 'teacher') {
      return [
        { label: 'Faculty Home', view: 'overview' },
        { label: 'Teaching Schedule', view: 'schedule' },
        { label: 'My Courses', view: 'courses' },
        { label: 'Students', view: 'people' },
        { label: 'Requests', view: 'campus' }
      ];
    }

    return [
      { label: 'Command Center', view: 'overview' },
      { label: 'Master Schedule', view: 'schedule' },
      { label: 'Academics', view: 'courses' },
      { label: 'People', view: 'people' },
      { label: 'Finance', view: 'finance' },
      { label: 'Campus Ops', view: 'campus' }
    ];
  });
}
