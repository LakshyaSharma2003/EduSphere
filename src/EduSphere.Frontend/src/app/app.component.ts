import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'edu-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected readonly role = signal('Super Admin');
  protected readonly tenant = signal('Demo Autonomous University');
  protected readonly headerLabel = computed(() => `${this.tenant()} · ${this.role()}`);
}
