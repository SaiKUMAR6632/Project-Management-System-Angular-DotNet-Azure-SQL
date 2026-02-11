import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.model';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html'
})
export class EmployeeEditComponent implements OnInit {
  form: FormGroup;
  employeeId!: string;
  isLoading = true;
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.params['id'];
    this.loadEmployee();
  }

  loadEmployee(): void {
    this.isLoading = true;
    this.employeeService.getEmployee(this.employeeId).subscribe({
      next: (employee) => {
        this.form.patchValue({
          fullName: employee.fullName,
          email: employee.email,
          designation: employee.designation,
          department: employee.department
        });
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load employee details';
        this.isLoading = false;
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    this.employeeService.updateEmployee(this.employeeId, this.form.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.error = error.message || 'Failed to update employee';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}