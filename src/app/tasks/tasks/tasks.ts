import { Component, inject } from '@angular/core';
import { TasksService } from '../tasks.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, map, of, startWith, Subject, switchMap } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-tasks',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    CheckboxModule
    ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
  standalone: true

})
export class Tasks {

  newTask: string = '';
  private reload$ = new Subject<void>();

  tasks$ = this.reload$.pipe(
    startWith(void 0),
    switchMap(() =>
      this.tasksService.getTasks().pipe(
        map((res: any) => this.extractTasks(res)),
        catchError((err) => {
          return of([]);
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
}