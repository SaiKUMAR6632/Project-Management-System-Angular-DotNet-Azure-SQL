import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { ProjectCreateComponent } from './components/project-create/project-create.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';

// Routing
import { ProjectsRoutingModule } from './../projects/project-routing.module';

// Shared Material Module
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';
import { EmployeeSelectionDialogComponent } from '../employees/employee-selection-dialog/employee-selection-dialog.component';


@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectCreateComponent,
    ProjectDetailsComponent,
    EmployeeSelectionDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ProjectsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ]
})
export class ProjectsModule {}