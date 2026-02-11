import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskListComponent } from 'src/app/tasks/task-list/task-list.component';
import { ProjectService } from '../../services/project.service';
import { EmployeeService } from 'src/app/employees/services/employee.service';
import { Project } from '../../models/project.model';
import { TaskFormDialogComponent } from 'src/app/tasks/task-form-dialog/task-form-dialog.component';
import { EmployeeSelectionDialogComponent } from '../../../employees/employee-selection-dialog/employee-selection-dialog.component';
import { fadeIn, slideIn, listAnimation, cardHover } from '../../../shared/animations';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  animations: [fadeIn, slideIn, listAnimation, cardHover]
})
export class ProjectDetailsComponent implements OnInit {
  projectId!: string;
  project?: Project;
  loading = true;
  @ViewChild(TaskListComponent) taskList?: TaskListComponent;
  
  employees: any[] = [];
  selectedEmployees: number[] = [];
  assignedEmployeeDetails: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    this.loadProject();
    this.loadEmployees();
    this.loadProjectEmployees();
  }

  loadProject() {
    this.loading = true;
    this.projectService.getById(this.projectId).subscribe({
      next: res => {
        this.project = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load project', 'Close', { duration: 3000 });
      }
    });
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: employees => {
        this.employees = employees;
      },
      error: () => {
        this.snackBar.open('Failed to load employees', 'Close', { duration: 3000 });
      }
    });
  }

  loadProjectEmployees() {
    this.projectService.getProjectEmployees(this.projectId).subscribe({
      next: projectEmployees => {
        this.selectedEmployees = projectEmployees.map((emp: any) => emp.employeeId);
        this.assignedEmployeeDetails = projectEmployees;
      },
      error: () => {
        this.snackBar.open('Failed to load assigned employees', 'Close', { duration: 3000 });
      }
    });
  }

  openEmployeeDialog() {
    const dialogRef = this.dialog.open(EmployeeSelectionDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: {
        employees: this.employees,
        selectedIds: this.selectedEmployees,
        projectId: this.projectId
      },
      panelClass: 'employee-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.selectedEmployees = result;
        this.saveEmployees();
      }
    });
  }

  saveEmployees() {
    this.projectService
      .assignEmployees(this.projectId, this.selectedEmployees)
      .subscribe({
        next: () => {
          this.snackBar.open('Team members assigned successfully', 'Close', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });
          this.loadProjectEmployees(); // Reload to get updated details
        },
        error: () => {
          this.snackBar.open('Failed to assign team members', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  getEmployeeName(id: number): string {
    return this.employees.find(e => e.id === id)?.fullName || 'Unknown';
  }

  removeEmployee(empId: number) {
    const employee = this.employees.find(e => e.id === empId);
    const confirmRemove = confirm(`Remove ${employee?.fullName || 'this employee'} from the project?`);
    
    if (!confirmRemove) return;

    this.selectedEmployees = this.selectedEmployees.filter(id => id !== empId);
    this.saveEmployees();
  }

  openTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: { projectId: this.projectId },
      panelClass: 'task-dialog-container'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && this.taskList) {
        this.taskList.loadTasks();
      }
    });
  }

  onTaskCreated() {
    if (this.taskList) {
      this.taskList.loadTasks();
    }
  }

  getTaskCountByStatus(status: string): number {
    if (!this.taskList?.tasks) return 0;
    return this.taskList.tasks.filter(t => {
      if (status === 'Todo') return t.status === 0;
      if (status === 'InProgress') return t.status === 1;
      if (status === 'Done') return t.status === 2;
      return false;
    }).length;
  }
}