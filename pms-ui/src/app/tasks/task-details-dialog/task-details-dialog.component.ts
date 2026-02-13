import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../services/task.service';
import { ProjectService } from '../../projects/services/project.service';
import { Task } from '../models/task.model';
import { TaskStatusOfProject } from '../models/task-status.enum';
import { Employee } from 'src/app/employees/models/employee.model';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

export interface TaskDetailsDialogData {
  task: Task;
  projectId: string;
}

@Component({
  selector: 'app-task-details-dialog',
  templateUrl: './task-details-dialog.component.html'
})
export class TaskDetailsDialogComponent implements OnInit, OnDestroy {
  task: Task;
  projectId: string;
  projectEmployees: Employee[] = [];
  filteredEmployees: Employee[] = []; // For search functionality
  statusEnum = TaskStatusOfProject;

  isLoadingEmployees = false;
  isAssigningEmployee = false;
  isUpdatingStatus = false;
  
  // Track original assignment for change detection
  private originalAssignmentId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<TaskDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDetailsDialogData,
    private taskService: TaskService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {
    // Initialize task with normalized data
    this.task = {
      ...data.task,
      id: data.task.id?.toLowerCase() || '',
      projectId: data.task.projectId?.toLowerCase() || '',
      assignedEmployeeId: data.task.assignedEmployeeId?.toLowerCase() || null,
      assignedEmployeeName: data.task.assignedEmployeeName || 'Unassigned'
    };
    this.projectId = data.projectId?.toLowerCase() || '';
    this.originalAssignmentId = this.task.assignedEmployeeId || null;
  }

  ngOnInit(): void {
    this.loadProjectEmployees();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load project employees with proper mapping
   */
  loadProjectEmployees(): void {
    this.isLoadingEmployees = true;
    
    this.projectService.getProjectEmployees(this.projectId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoadingEmployees = false)
      )
      .subscribe({
        next: (employees: any[]) => {
          // Map employee data with normalized IDs
          this.projectEmployees = employees.map(emp => ({
            id: (emp.employeeId || emp.id).toLowerCase(),
            fullName: emp.fullName || '',
            email: emp.email || '',
            designation: emp.designation || '',
            department: emp.department || '',
            phone: emp.phone || '',
            isActive: emp.isActive ?? true,
            createdAt: emp.createdAt || new Date().toISOString(),
            updatedAt: emp.updatedAt || null,
            assignedAt: emp.assignedAt || new Date().toISOString()
          }));
          
          // Initialize filtered employees
          this.filteredEmployees = this.projectEmployees;
          
          console.log('✅ Employees loaded:', this.projectEmployees.length);
          
          // Log current assignment
          if (this.task.assignedEmployeeId) {
            const assigned = this.projectEmployees.find(e => e.id === this.task.assignedEmployeeId);
            console.log('Current assignment:', assigned?.fullName || 'Unknown');
          }
        },
        error: (error) => {
          console.error('Error loading employees:', error);
          this.snackBar.open('Failed to load employees', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  /**
   * Handle status change
   */
  onStatusChange(newStatus: TaskStatusOfProject): void {
    if (this.isUpdatingStatus || this.task.status === newStatus) {
      return;
    }

    const oldStatus = this.task.status;
    this.isUpdatingStatus = true;
    this.task.status = newStatus;

    this.taskService.updateStatus(this.projectId, this.task.id, newStatus)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isUpdatingStatus = false)
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Status updated successfully', 'Close', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Error updating status:', error);
          this.task.status = oldStatus;
          this.snackBar.open('Failed to update status', 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  /**
   * Handle employee selection change - UI ONLY, no API call
   */
  onEmployeeSelectionChange(newEmployeeId: string | null): void {
    // Normalize and store the selected value
    const normalizedId = newEmployeeId?.toLowerCase() || null;
    
    console.log('Employee selection changed:', {
      new: normalizedId,
      current: this.task.assignedEmployeeId,
      taskId: this.task.id
    });

    // Update the task's assigned employee ID (for UI)
    this.task.assignedEmployeeId = normalizedId;
    
    // Update employee name for display
    if (normalizedId) {
      const employee = this.projectEmployees.find(e => e.id === normalizedId);
      this.task.assignedEmployeeName = employee?.fullName || 'Unknown';
    } else {
      this.task.assignedEmployeeName = 'Unassigned';
    }
  }

  /**
   * Save employee assignment - API call
   */
  assignEmployee(employeeId: string | null): void {
    if (this.isAssigningEmployee) {
      return;
    }

    const normalizedId = employeeId?.toLowerCase() || null;
    const oldEmployeeId = this.originalAssignmentId;
    const oldEmployeeName = this.task.assignedEmployeeName;

    this.isAssigningEmployee = true;

    console.log('Saving assignment:', {
      projectId: this.projectId,
      taskId: this.task.id,
      employeeId: normalizedId
    });

    this.taskService.assignEmployee(this.projectId, this.task.id, normalizedId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isAssigningEmployee = false)
      )
      .subscribe({
        next: (response) => {
          console.log('Assignment saved successfully:', response);
          
          // Update original assignment after successful save
          this.originalAssignmentId = normalizedId;
          
          this.snackBar.open(
            normalizedId ? 'Employee assigned successfully' : 'Employee unassigned successfully',
            'Close',
            { duration: 2000, panelClass: ['success-snackbar'] }
          );
        },
        error: (error) => {
          console.error('Error saving assignment:', error);
          
          // Rollback UI on error
          this.task.assignedEmployeeId = oldEmployeeId;
          this.task.assignedEmployeeName = oldEmployeeName;
          this.originalAssignmentId = oldEmployeeId;
          
          this.snackBar.open(
            error.error?.message || 'Failed to assign employee',
            'Close',
            { duration: 4000, panelClass: ['error-snackbar'] }
          );
        }
      });
  }

  /**
   * Check if assignment has changed (for save button enable/disable)
   */
  isAssignmentChanged(): boolean {
    const currentId = this.task.assignedEmployeeId?.toLowerCase() || null;
    const originalId = this.originalAssignmentId?.toLowerCase() || null;
    return currentId !== originalId;
  }

  /**
   * Get selected employee ID for dropdown
   */
  getSelectedEmployeeId(): string | null {
    return this.task.assignedEmployeeId?.toLowerCase() || null;
  }

  /**
   * Get employee name by ID
   */
  getEmployeeName(employeeId: string | null | undefined): string {
    if (!employeeId) return 'Unassigned';
    
    const normalizedId = employeeId.toLowerCase();
    const employee = this.projectEmployees.find(e => e.id === normalizedId);
    return employee?.fullName || 'Unknown';
  }

  /**
   * Get employee initials for avatar
   */
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

  /**
   * Get status color class
   */
  getStatusColorClass(status: TaskStatusOfProject): string {
    switch (status) {
      case this.statusEnum.Todo:
        return 'bg-gray-500';
      case this.statusEnum.InProgress:
        return 'bg-blue-500';
      case this.statusEnum.Done:
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  }

  /**
   * Get status badge class
   */
  getStatusBadgeClass(status: TaskStatusOfProject): string {
    switch (status) {
      case this.statusEnum.Todo:
        return 'bg-gray-100 text-gray-700';
      case this.statusEnum.InProgress:
        return 'bg-blue-100 text-blue-700';
      case this.statusEnum.Done:
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  /**
   * Get status text
   */
  getStatusText(status: TaskStatusOfProject): string {
    switch (status) {
      case this.statusEnum.Todo:
        return 'Todo';
      case this.statusEnum.InProgress:
        return 'In Progress';
      case this.statusEnum.Done:
        return 'Done';
      default:
        return 'Unknown';
    }
  }

  /**
   * Filter employees for search functionality
   */
  filterEmployees(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredEmployees = this.projectEmployees;
      return;
    }
    
    const term = searchTerm.toLowerCase();
    this.filteredEmployees = this.projectEmployees.filter(emp => 
      emp.fullName?.toLowerCase().includes(term) ||
      emp.email?.toLowerCase().includes(term) ||
      emp.designation?.toLowerCase().includes(term)
    );
  }

  /**
   * Close dialog
   */
  close(): void {
    this.dialogRef.close(this.task);
  }
}