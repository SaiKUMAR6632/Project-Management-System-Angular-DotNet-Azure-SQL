// dashboard/dashboard.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { DashboardStats } from './dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private api = 'https://localhost:7047/api/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.api}/stats`).pipe(
      catchError(error => {
        console.error('Dashboard API error:', error);
        // Return default stats if API fails
        return of({
          totalProjects: 0,
          activeProjects: 0,
          completedProjects: 0,
          plannedProjects: 0,
          totalTasks: 0,
          todoTasks: 0,
          inProgressTasks: 0,
          completedTasks: 0,
          taskCompletionPercentage: 0,
          projectCompletionPercentage: 0
        });
      })
    );
  }
}