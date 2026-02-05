import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, AsyncPipe,CommonModule],
  template: `
    <div class="min-h-screen flex">
      <aside class="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <h2 class="text-xl font-bold mb-6">PMS</h2>

        <nav class="space-y-2">
          <a routerLink="/projects" routerLinkActive="text-blue-400" class="block">
            Projects
          </a>
        </nav>

        <!-- User info -->
        <div class="mt-auto pt-6 border-t border-gray-700" *ngIf="auth.user$ | async as user">
          <p class="text-sm text-gray-300">
            Logged in as:
          </p>
          <p class="font-semibold">
            {{ user.firstName }} {{ user.lastName }}
          </p>

          <button
            (click)="logout()"
            class="mt-3 w-full bg-red-600 hover:bg-red-700 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      <main class="flex-1 p-6 bg-gray-100">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class LayoutComponent {
  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}