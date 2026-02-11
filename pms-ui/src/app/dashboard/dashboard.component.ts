// dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from './dashboard.service';
import { DashboardStats } from './dashboard.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  stats?: DashboardStats;
  isLoading = true;
  error: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.error = null;
    
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.error = 'Failed to load dashboard statistics';
        this.isLoading = false;
        
        this.snackBar.open('Failed to load dashboard statistics', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  getTotalProjects(): number {
    return this.stats?.totalProjects || 0;
  }

  getTotalTasks(): number {
    return this.stats?.totalTasks || 0;
  }

  getPendingTasksCount(): number {
    if (!this.stats) return 0;
    return (this.stats.todoTasks || 0) + (this.stats.inProgressTasks || 0);
  }

  getProjectCompletion(): number {
    return this.stats?.projectCompletionPercentage || 0;
  }

  getTaskCompletion(): number {
    return this.stats?.taskCompletionPercentage || 0;
  }

  refresh(): void {
    this.loadStats();
  }
}