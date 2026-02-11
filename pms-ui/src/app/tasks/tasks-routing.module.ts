import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { TaskListComponent } from '../tasks/task-list/task-list.component';
import { TaskFormDialogComponent } from './task-form-dialog/task-form-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: TaskListComponent
  },
  {
    path: 'create',
    component: TaskFormDialogComponent
  },
  {
    path: 'edit/:id',
    component: TaskFormDialogComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }