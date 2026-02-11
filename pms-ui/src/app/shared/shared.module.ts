import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module'; // Your shared Material module
import { TaskListComponent } from '../tasks/task-list/task-list.component';
import { TaskFormDialogComponent } from '../tasks/task-form-dialog/task-form-dialog.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { EmployeeSelectionDialogComponent } from '../employees/employee-selection-dialog/employee-selection-dialog.component';

@NgModule({
  declarations: [
    TaskListComponent,
    TaskFormDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule
  ],
  exports: [
    TaskListComponent,
    TaskFormDialogComponent,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class SharedModule { }