import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.error = null;
    
    this.employeeService.getEmployees().subscribe({
      next: data => {
        this.employees = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load employees';
        this.isLoading = false;
      }
    });
  }

  createEmployee(): void {
    this.router.navigate(['/employees/create']);
  }

  editEmployee(id: string): void {
    this.router.navigate(['/employees/edit', id]);
  }

  deleteEmployee(id: string): void {
  if (confirm('Are you sure you want to delete this employee?')) {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.loadEmployees(); // Refresh list
      },
      error: (error) => {
        alert('Failed to delete employee: ' + error.message);
      }
    });
  }
}
}