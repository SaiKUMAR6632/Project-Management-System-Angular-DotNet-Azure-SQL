import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html'
})
export class EmployeeCreateComponent implements OnInit {
  form: FormGroup;
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    this.employeeService.createEmployee(this.form.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.error = error.message || 'Failed to create employee';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}