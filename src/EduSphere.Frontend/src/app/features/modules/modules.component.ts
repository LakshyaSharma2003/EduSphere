import { Component, OnInit, computed, inject } from '@angular/core';

import { EduSphereApiService } from '../../core/edusphere-api.service';

@Component({
  selector: 'edu-modules',
  standalone: true,
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.css'
})
export class ModulesComponent implements OnInit {
  protected readonly api = inject(EduSphereApiService);
  protected readonly categories = computed(() => {
    const groups = new Map<string, number>();
    for (const module of this.api.modules()) {
      groups.set(module.category, (groups.get(module.category) ?? 0) + 1);
    }

    return Array.from(groups, ([name, count]) => ({ name, count }));
  });

  ngOnInit(): void {
    this.api.loadModules();
  }
}
