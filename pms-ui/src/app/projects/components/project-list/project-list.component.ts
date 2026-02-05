import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.projectService.getAll().subscribe({
      next: data => {
        this.projects = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load projects';
        this.isLoading = false;
      }
    });
  }
}