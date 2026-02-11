import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { TaskStatusOfProject } from '../models/task-status.enum';
import { TaskFormDialogComponent } from '../task-form-dialog/task-form-dialog.component';
import { fadeIn, listAnimation, cardHover } from '../../shared/animations';

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
  statusEnum = TaskStatusOfProject;
  isLoading = false;
  updatingTaskIds = new Set<string>();
  deletingTaskIds = new Set<string>();
  currentFilter = 'all';

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

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

  updateStatus(projectId: string, taskId: string, newStatus: TaskStatusOfProject) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    const oldStatus = task.status;
    
    if (this.updatingTaskIds.has(taskId)) {
      return;
    }

    this.updatingTaskIds.add(taskId);
    task.status = newStatus;

    this.taskService.updateStatus(projectId, taskId, newStatus).subscribe({
      next: () => {
        this.updatingTaskIds.delete(taskId);
        this.snackBar.open('Status updated successfully', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
        this.filterTasks(this.currentFilter);
      },
      error: (error) => {
        console.error('Error updating status:', error);
        task.status = oldStatus;
        this.updatingTaskIds.delete(taskId);
        this.snackBar.open('Failed to update status. Please try again.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  deleteTask(projectId: string, taskId: string) {
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

  isTaskUpdating(taskId: string): boolean {
    return this.updatingTaskIds.has(taskId);
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