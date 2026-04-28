import { Component, inject } from '@angular/core';
import { TasksService } from '../tasks.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, map, of, startWith, Subject, switchMap, tap, finalize } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-tasks',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    CheckboxModule, 
    ProgressSpinnerModule,
    SkeletonModule
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
  standalone: true

})
export class Tasks {

  newTask: string = '';
  private reload$ = new Subject<void>();
  filter: 'all' | 'completed' | 'pending' = 'all';
  page = 1;
  lastPage = 1;
  total = 0;

  loading = false;

  tasks$ = this.reload$.pipe(
    startWith(void 0),
    tap(() => setTimeout(() => (this.loading = true))),
    switchMap(() =>
      this.tasksService.getTasks(this.getQueryParams()).pipe(
        tap((res: any) => this.setPagination(res)),
        map((res: any) => this.extractTasks(res)),
        catchError((err) => {
          return of([]);
        })
        ,
        finalize(() => {
          this.loading = false;
        })
      )
    )
  );

  constructor(private tasksService: TasksService) {}

  private extractTasks(res: any): any[] {
    if (Array.isArray(res)) {
      return res;
    }

    if (Array.isArray(res?.tasks)) {
      return res.tasks;
    }

    if (Array.isArray(res?.data)) {
      return res.data;
    }

    return [];
  }

  private getTaskId(task: any): string {
    return String(task?.id ?? task?._id ?? '');
  }

  trackByTaskId = (_: number, task: any) => this.getTaskId(task);

  toggleTask(task: any) {
    const taskId = this.getTaskId(task);

    if (!taskId) {
      return;
    }

    this.tasksService.updateTask(taskId, {
      completed: !task.completed
    }).subscribe(() => this.reload$.next());
  }

  deleteTask(task: any) {
    const taskId = this.getTaskId(task);

    if (!taskId) {
      return;
    }

    this.tasksService.deleteTask(taskId).subscribe(() => this.reload$.next());
  }

  createTask() {
    if (!this.newTask) return;

    this.tasksService.createTask({ title: this.newTask }).subscribe(() => {
      this.newTask = '';
      this.reload$.next();
    });
  }

  private getQueryParams() {
    const params: { completed?: string; page?: number } = {};

    if (this.filter === 'completed') {
      params.completed = 'true';
    } else if (this.filter === 'pending') {
      params.completed = 'false';
    }

    params.page = this.page;

    return params;
  }

  private setPagination(res: any) {
    this.total = res?.meta?.total ?? this.total;
    this.page = res?.meta?.page ?? this.page;
    this.lastPage = res?.meta?.lastPage ?? this.lastPage;
  }

  loadTasks() {
    this.reload$.next();
  }

  setFilter(value: 'all' | 'completed' | 'pending') {
    this.filter = value;
    this.page = 1;
    this.loadTasks();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadTasks();
    }
  }

  nextPage() {
    if (this.page < this.lastPage) {
      this.page++;
      this.loadTasks();
    }
  }
}
