import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../services/task.service';
import { TaskStatusOfProject } from '../models/task-status.enum';

@Component({
  selector: 'app-task-form-dialog',
  templateUrl: './task-form-dialog.component.html',
})
export class TaskFormDialogComponent implements OnInit {
  form: FormGroup;
  statusEnum = TaskStatusOfProject;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projectId: string }
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      status: [TaskStatusOfProject.Todo, Validators.required]
    });
  }

  ngOnInit(): void {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    
    this.taskService.create(this.data.projectId, this.form.value).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.dialogRef.close(true); // Close dialog and return true (success)
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Failed to create task:', error);
        // You can show an error message here
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}