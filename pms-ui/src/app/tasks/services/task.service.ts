import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskStatusOfProject } from '../models/task-status.enum';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private api = 'https://localhost:7047/api';

  constructor(private http: HttpClient) {}

  getByProject(projectId: string) {
    return this.http.get<Task[]>(
      `${this.api}/projects/${projectId}/tasks`
    ).pipe(map(tasks=>tasks.map(task => ({...task,status:this.mapStatus(task.status)}))));
  }

  create(projectId: string, payload: {
    title: string;
    description?: string;
    status: TaskStatusOfProject;
  }) {
    return this.http.post(
      `${this.api}/projects/${projectId}/tasks`, 
      payload
    );
  }

  updateStatus(projectId: string, taskId: string, status: TaskStatusOfProject) {
    return this.http.patch(
      `${this.api}/projects/${projectId}/tasks/${taskId}/status`, 
      { status: status } 
    );
  }

  delete(projectId: string, taskId: string) {
    return this.http.delete(
      `${this.api}/projects/${projectId}/tasks/${taskId}`
    );
  }
  private mapStatus(status: any): TaskStatusOfProject {
  if (typeof status === 'string') {
    return TaskStatusOfProject[status as keyof typeof TaskStatusOfProject];
  }
  return status;
}
}