import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EduSphereApiService } from '../../core/edusphere-api.service';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
  });

  it('renders the command center metrics without zone.js assumptions', () => {
    const api = TestBed.inject(EduSphereApiService);
    api.login(api.personas()[0]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Welcome back');
    expect(compiled.textContent).toContain('Next Up');
  });
});
