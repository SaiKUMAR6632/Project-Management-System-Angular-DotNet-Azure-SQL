import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectCreateComponent } from './components/project-create/project-create.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectsRoutingModule } from './project-routing.module';
import { FormsModule } from '@angular/forms';
import { MatCardActions, MatCardContent, MatCard, MatCardTitle, MatCardSubtitle, MatCardHeader } from "@angular/material/card";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [ProjectListComponent,ProjectCreateComponent],
  imports: [
    CommonModule,
    RouterModule,
    ProjectsRoutingModule,
    FormsModule,
    MatCardActions,
    MatCardContent,
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatCardHeader,
    MatProgressSpinner,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
]
})
export class ProjectsModule {}
