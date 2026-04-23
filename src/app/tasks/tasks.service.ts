import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getTasks(params: any = {}) {
    const filteredParams: any = {};

    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== undefined && value !== null) {
        filteredParams[key] = value;
      }
    });

    return this.http.get<any>(this.apiUrl, { params: filteredParams });
  }

  createTask(data: { title: string }) {
    return this.http.post(this.apiUrl, data);
  }

  updateTask(id: string, data: any) {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  deleteTask(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}