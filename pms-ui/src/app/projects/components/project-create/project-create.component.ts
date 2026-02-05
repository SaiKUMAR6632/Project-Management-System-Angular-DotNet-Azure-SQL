import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
})
export class ProjectCreateComponent {
  name = '';
  description = '';
  isSubmitting = false;

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) {}

  submit(): void {
    if (!this.name.trim()) return;

    this.isSubmitting = true;

    this.projectService.create({
      name: this.name,
      description: this.description
    }).subscribe({
      next: () => this.router.navigate(['/projects']),
      error: () => this.isSubmitting = false
    });
  }
}
