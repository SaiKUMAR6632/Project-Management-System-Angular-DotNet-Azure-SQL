import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '../services/task.service';
import { ProjectService } from '../../projects/services/project.service';
import { Task } from '../models/task.model';
import { TaskStatusOfProject } from '../models/task-status.enum';
import { TaskFormDialogComponent } from '../task-form-dialog/task-form-dialog.component';
import { TaskDetailsDialogComponent } from '../task-details-dialog/task-details-dialog.component';
import { fadeIn, listAnimation, cardHover } from '../../shared/animations';
import { Employee } from 'src/app/employees/models/employee.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  animations: [fadeIn, listAnimation, cardHover]
})
export class TaskListComponent implements OnInit {
  @Input() projectId!: string;
  @Output() taskCreated = new EventEmitter<void>();

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  projectEmployees: Employee[] = [];
  statusEnum = TaskStatusOfProject;

  isLoading = false;
  deletingTaskIds = new Set<string>();
  currentFilter = 'all';

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadTasks();
  }

  openCreateTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: { projectId: this.projectId },
      panelClass: 'task-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  openTaskDetailsDialog(task: Task): void {
  const dialogRef = this.dialog.open(TaskDetailsDialogComponent, {
    width: '800px',           // Increased from 600px
    maxWidth: '95vw',
    maxHeight: '90vh',
    panelClass: 'task-details-dialog-container',
    data: { 
      task: task,
      projectId: this.projectId
    },
    autoFocus: false,        // Prevents auto-focus on first element
    disableClose: false,     // Allows closing by clicking backdrop
    backdropClass: 'dialog-backdrop' // Optional custom backdrop
  });

  dialogRef.afterClosed().subscribe(updatedTask => {
    if (updatedTask) {
      const index = this.tasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
        this.filterTasks(this.currentFilter);
      }
    }
  });
}

getEmployeeInitials(employeeId: string | null | undefined): string {
    if (!employeeId) return 'U';
    
    const name = this.getEmployeeName(employeeId);
    if (name === 'Unassigned' || name === 'Unknown') return '?';
    
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getEmployeeName(employeeId: string | null | undefined): string {
    if (!employeeId) return 'Unassigned';
    
    const normalizedId = employeeId.toLowerCase();
    const employee = this.projectEmployees.find(e => e.id === normalizedId);
    return employee?.fullName || 'Unknown';
  }

  loadTasks() {
    this.isLoading = true;
    this.taskService.getByProject(this.projectId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filterTasks(this.currentFilter);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.isLoading = false;
        this.snackBar.open('Failed to load tasks', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  filterTasks(filter: string) {
    this.currentFilter = filter;
    if (filter === 'all') {
      this.filteredTasks = this.tasks;
    } else if (filter === 'active') {
      this.filteredTasks = this.tasks.filter(t => t.status !== this.statusEnum.Done);
    } else if (filter === 'completed') {
      this.filteredTasks = this.tasks.filter(t => t.status === this.statusEnum.Done);
    }
  }

  deleteTask(projectId: string, taskId: string, event: Event) {
    // Stop event propagation to prevent opening the dialog
    event.stopPropagation();

    if (this.deletingTaskIds.has(taskId)) {
      return;
    }

    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    const confirmed = confirm(`Are you sure you want to delete "${task.title}"?`);
    if (!confirmed) return;

    this.deletingTaskIds.add(taskId);

    this.taskService.delete(projectId, taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.filterTasks(this.currentFilter);
        this.deletingTaskIds.delete(taskId);
        
        this.snackBar.open('Task deleted successfully', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.deletingTaskIds.delete(taskId);
        
        this.snackBar.open('Failed to delete task. Please try again.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  isTaskDeleting(taskId: string): boolean {
    return this.deletingTaskIds.has(taskId);
  }

  getCompletedCount(): number {
    return this.tasks.filter(t => t.status === this.statusEnum.Done).length;
  }

  getProgressPercentage(): number {
    if (this.tasks.length === 0) return 0;
    return Math.round((this.getCompletedCount() / this.tasks.length) * 100);
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }
}