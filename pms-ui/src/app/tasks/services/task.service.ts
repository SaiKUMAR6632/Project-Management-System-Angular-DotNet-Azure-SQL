import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskStatusOfProject } from '../models/task-status.enum';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private api = 'https://localhost:7047/api';

  constructor(private http: HttpClient) {}

  getByProject(projectId: string): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${this.api}/projects/${projectId}/tasks`
    ).pipe(
      map(tasks => tasks.map(task => ({
        ...task,
        status: this.mapStatus(task.status),
        assignedEmployeeId: task.assignedEmployeeId || null,
        assignedEmployeeName: task.assignedEmployeeName || 'Unassigned'
      })))
    );
  }

  create(projectId: string, payload: {
    title: string;
    description?: string;
    status: TaskStatusOfProject;
    assignedEmployeeId?: string | null;
  }): Observable<any> {
    return this.http.post(
      `${this.api}/projects/${projectId}/tasks`,
      payload
    );
  }

  // ✅ FIXED: Wrapped status in UpdateTaskStatusDto object
  updateStatus(
    projectId: string,
    taskId: string,
    status: TaskStatusOfProject
  ): Observable<any> {
    return this.http.patch(
      `${this.api}/projects/${projectId}/tasks/${taskId}/status`,
      { status: status }  // ✅ Matches UpdateTaskStatusDto
    );
  }

  // ✅ FIXED: Wrapped employeeId in AssignEmployeeToTaskDto object
  assignEmployee(
    projectId: string,
    taskId: string,
    employeeId: string | null
  ): Observable<any> {
    return this.http.patch(
      `${this.api}/projects/${projectId}/tasks/${taskId}/assign`,
      { assignedEmployeeId: employeeId }  // ✅ Matches AssignEmployeeToTaskDto
    );
  }

  delete(projectId: string, taskId: string): Observable<any> {
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