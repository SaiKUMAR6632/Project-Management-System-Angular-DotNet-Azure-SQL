import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, AsyncPipe, CommonModule, MatIconModule],
  template: `
    <div class="min-h-screen flex">
      <!-- Fixed Sidebar -->
      <aside class="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-xl fixed h-screen top-0 left-0">
        <!-- Logo -->
        <div class="p-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <mat-icon class="!text-white !w-6 !h-6">dashboard</mat-icon>
            </div>
            <h1 class="text-xl font-bold tracking-tight">Project Management</h1>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-6">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">MAIN</h3>
          
          <!-- Dashboard Link -->
          <a 
            routerLink="/dashboard" 
            routerLinkActive="bg-blue-500/10 text-blue-400 border-r-4 border-blue-500" 
            [routerLinkActiveOptions]="{exact: true}"
            class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-all duration-200 group mb-2"
          >
            <mat-icon class="group-hover:text-blue-400 text-gray-400 !w-5 !h-5">dashboard</mat-icon>
            <span class="font-medium">Dashboard</span>
          </a>

          <!-- Projects Link -->
          <a 
            routerLink="/projects" 
            routerLinkActive="bg-blue-500/10 text-blue-400 border-r-4 border-blue-500" 
            class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-all duration-200 group mb-2"
          >
            <mat-icon class="group-hover:text-blue-400 text-gray-400 !w-5 !h-5">folder</mat-icon>
            <span class="font-medium">Projects</span>
          </a>

          <!-- Employees Link -->
          <a 
            routerLink="/employees" 
            routerLinkActive="bg-blue-500/10 text-blue-400 border-r-4 border-blue-500" 
            class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-all duration-200 group mb-2"
          >
            <mat-icon class="group-hover:text-blue-400 text-gray-400 !w-5 !h-5">people</mat-icon>
            <span class="font-medium">Employees</span>
          </a>
        </nav>

        <!-- User Profile -->
        <div class="p-6 border-t border-gray-700/50" *ngIf="auth.user$ | async as user">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="font-bold text-white">
                {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm truncate">
                {{ user.firstName }} {{ user.lastName }}
              </p>
              <p class="text-xs text-gray-400 truncate">
                {{ user.email }}
              </p>
            </div>
          </div>

          <button
            (click)="logout()"
            class="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2.5 rounded-lg transition-all duration-200 group"
          >
            <mat-icon class="!w-5 !h-5">logout</mat-icon>
            <span class="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 bg-gray-50 min-h-screen ml-64">
        <div class="p-6">
          <router-outlet></router-outlet>
        </div>
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