import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private api = 'https://localhost:7047/api/employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.api);
  }

  getEmployee(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.api}/${id}`);
  }

  createEmployee(data: any): Observable<any> {
    return this.http.post(this.api, data);
  }

  updateEmployee(id: string, data: any): Observable<any> {
    return this.http.put(`${this.api}/${id}`, data);
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}