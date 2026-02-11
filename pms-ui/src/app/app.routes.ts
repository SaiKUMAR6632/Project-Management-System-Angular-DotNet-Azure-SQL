import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'projects',
        loadChildren: () =>
          import('./projects/projects.module').then(m => m.ProjectsModule)
      } ,
        {
      path: 'employees',
      loadChildren: () =>
        import('./employees/employees.module').then(m => m.EmployeesModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => 
          import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
