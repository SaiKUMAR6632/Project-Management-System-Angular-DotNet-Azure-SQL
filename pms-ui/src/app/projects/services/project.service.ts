import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly apiUrl = 'https://localhost:7047/api/projects';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

   getById(id: string) {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  create(payload: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, payload);
  }

  assignEmployees(projectId: string, employeeIds: number[]) {
  return this.http.post(
    `${this.apiUrl}/${projectId}/employees/assign`,
    { projectId, employeeIds }
  );
  }

  getProjectEmployees(projectId: string) {
  return this.http.get<any[]>(
    `${this.apiUrl}/${projectId}/employees`
  );
}

  removeEmployeeFromProject(projectId: string, employeeId: number) :Observable<any> {
    return this.http.delete(`${this.apiUrl}/${projectId}/employees/${employeeId}`);
  }
}