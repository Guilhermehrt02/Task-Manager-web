import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getTasks() {
    return this.http.get(this.apiUrl);
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