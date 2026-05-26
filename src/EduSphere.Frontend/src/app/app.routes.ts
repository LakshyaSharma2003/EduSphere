import { Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ModulesComponent } from './features/modules/modules.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'modules', component: ModulesComponent },
  { path: '**', redirectTo: '' }
];
