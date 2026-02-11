import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectCreateComponent } from './components/project-create/project-create.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';

const routes: Routes = [
  // List all projects
  { path: '', component: ProjectListComponent },

  // Create new project
  { path: 'create', component: ProjectCreateComponent },

  {path: ':id', component: ProjectDetailsComponent} 

  // You can add more child routes later:
  // { path: 'edit/:id', component: ProjectEditComponent },
  // { path: 'details/:id', component: ProjectDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {}
