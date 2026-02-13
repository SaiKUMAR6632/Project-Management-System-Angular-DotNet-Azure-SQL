import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module'; // Your shared Material module
import { TaskListComponent } from '../tasks/task-list/task-list.component';
import { TaskFormDialogComponent } from '../tasks/task-form-dialog/task-form-dialog.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { EmployeeSelectionDialogComponent } from '../employees/employee-selection-dialog/employee-selection-dialog.component';
import {TaskDetailsDialogComponent} from '../../../src/app/tasks/task-details-dialog/task-details-dialog.component';

@NgModule({
  declarations: [
    TaskListComponent,
    TaskFormDialogComponent,
    TaskDetailsDialogComponent
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
    TaskDetailsDialogComponent,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class SharedModule { }