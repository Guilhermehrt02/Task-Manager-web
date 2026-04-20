import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { Tasks } from './tasks';
import { TasksService } from '../tasks.service';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';

describe('Tasks', () => {
  let component: Tasks;
  let fixture: ComponentFixture<Tasks>;
  let tasksServiceSpy: jasmine.SpyObj<TasksService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TasksService', ['getTasks', 'createTask', 'updateTask', 'deleteTask']);
    spy.getTasks.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [Tasks, CommonModule, FormsModule], 
      providers: [
        { provide: TasksService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Tasks);
    component = fixture.componentInstance;
    tasksServiceSpy = TestBed.inject(TasksService) as jasmine.SpyObj<TasksService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('extractTasks', () => {
    it('should return array if res is array', () => {
      const res = [{ id: 1, title: 'Task' }];
      expect(component['extractTasks'](res)).toEqual(res);
    });

    it('should return res.tasks if it exists', () => {
      const res = { tasks: [{ id: 1, title: 'Task' }] };
      expect(component['extractTasks'](res)).toEqual(res.tasks);
    });

    it('should return res.data if it exists', () => {
      const res = { data: [{ id: 1, title: 'Task' }] };
      expect(component['extractTasks'](res)).toEqual(res.data);
    });

    it('should return empty array otherwise', () => {
      const res = {};
      expect(component['extractTasks'](res)).toEqual([]);
    });
  });

  describe('getTaskId', () => {
    it('should return id as string', () => {
      const task = { id: 1 };
      expect(component['getTaskId'](task)).toBe('1');
    });

    it('should return _id if id not present', () => {
      const task = { _id: 'abc' };
      expect(component['getTaskId'](task)).toBe('abc');
    });

    it('should return empty string if neither', () => {
      const task = {};
      expect(component['getTaskId'](task)).toBe('');
    });
  });

  describe('trackByTaskId', () => {
    it('should return task id', () => {
      const task = { id: 1 };
      expect(component.trackByTaskId(0, task)).toBe('1');
    });
  });

  describe('toggleTask', () => {
    it('should call updateTask with toggled completed', () => {
      const task = { id: 1, completed: false };
      tasksServiceSpy.updateTask.and.returnValue(of({}));

      component.toggleTask(task);

      expect(tasksServiceSpy.updateTask).toHaveBeenCalledWith('1', { completed: true });
    });

    it('should not call updateTask if no id', () => {
      const task = {};
      component.toggleTask(task);
      expect(tasksServiceSpy.updateTask).not.toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should call deleteTask with id', () => {
      const task = { id: 1 };
      tasksServiceSpy.deleteTask.and.returnValue(of({}));

      component.deleteTask(task);

      expect(tasksServiceSpy.deleteTask).toHaveBeenCalledWith('1');
    });

    it('should not call deleteTask if no id', () => {
      const task = {};
      component.deleteTask(task);
      expect(tasksServiceSpy.deleteTask).not.toHaveBeenCalled();
    });
  });

  describe('createTask', () => {
    it('should call createTask and reset newTask', () => {
      component.newTask = 'New Task';
      tasksServiceSpy.createTask.and.returnValue(of({}));

      component.createTask();

      expect(tasksServiceSpy.createTask).toHaveBeenCalledWith({ title: 'New Task' });
      expect(component.newTask).toBe('');
    });

    it('should not call createTask if newTask is empty', () => {
      component.newTask = '';
      component.createTask();
      expect(tasksServiceSpy.createTask).not.toHaveBeenCalled();
    });
  });

  describe('tasks$ observable', () => {
    it('should load tasks on init', (done) => {
      const mockTasks = [{ id: 1, title: 'Task' }];
      tasksServiceSpy.getTasks.and.returnValue(of(mockTasks));

      component.tasks$.subscribe(tasks => {
        expect(tasks).toEqual(mockTasks);
        done();
      });
    });
  });
});

describe('Tasks Component - Template Tests', () => {
  let component: Tasks;
  let fixture: ComponentFixture<Tasks>;
  let tasksServiceSpy: jasmine.SpyObj<TasksService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TasksService', ['getTasks', 'createTask', 'updateTask', 'deleteTask']);
    spy.getTasks.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        Tasks,
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        InputTextModule,
        ButtonModule,
        CardModule,
        CheckboxModule
      ],
      providers: [{ provide: TasksService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(Tasks);
    component = fixture.componentInstance;
    tasksServiceSpy = TestBed.inject(TasksService) as jasmine.SpyObj<TasksService>;
  });

  describe('Template Rendering', () => {
    it('should render the title "Tasks"', () => {
      fixture.detectChanges();
      const title = fixture.nativeElement.querySelector('h2');
      expect(title.textContent).toContain('Tasks');
    });

    it('should render input field for new task', () => {
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input[pInputText]');
      expect(input).toBeTruthy();
      expect(input.placeholder).toBe('Nova tarefa');
    });

    it('should render create button', () => {
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button[pButton]');
      expect(button).toBeTruthy();
    });
  });

  describe('Two-Way Binding', () => {
    it('should update newTask when input changes', (done) => {
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input[pInputText]') as HTMLInputElement;

      component.newTask = 'Test Task';
      input.value = 'Test Task';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(component.newTask).toBe('Test Task');
        done();
      });
    });

    it('should clear input after creating task', (done) => {
      tasksServiceSpy.createTask.and.returnValue(of({}));
      tasksServiceSpy.getTasks.and.returnValue(of([]));

      component.newTask = 'New Task';
      fixture.detectChanges();

      component.createTask();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(component.newTask).toBe('');
        done();
      });
    });
  });

  describe('Task List Rendering', () => {
    it('should display empty state when no tasks', (done) => {
      tasksServiceSpy.getTasks.and.returnValue(of([]));

      fixture.detectChanges();

      component.tasks$.subscribe(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          const emptyState = fixture.nativeElement.querySelector('.text-center');
          expect(emptyState).toBeTruthy();
          expect(emptyState.textContent).toContain('Nenhuma tarefa encontrada');
          done();
        });
      });
    });

    it('should render task cards when tasks exist', (done) => {
      const mockTasks = [
        { id: '1', title: 'Task 1', completed: false },
        { id: '2', title: 'Task 2', completed: true }
      ];
      tasksServiceSpy.getTasks.and.returnValue(of(mockTasks));

      fixture.detectChanges();

      component.tasks$.subscribe(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          const cards = fixture.nativeElement.querySelectorAll('p-card');
          expect(cards.length).toBe(2);
          done();
        });
      });
    });
  });

  describe('Task Completion Toggle', () => {
    it('should apply line-through class when task is completed', (done) => {
      const mockTasks = [
        { id: '1', title: 'Completed Task', completed: true }
      ];
      tasksServiceSpy.getTasks.and.returnValue(of(mockTasks));

      fixture.detectChanges();

      component.tasks$.subscribe(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          const span = fixture.nativeElement.querySelector('span.line-through');
          expect(span).toBeTruthy();
          expect(span.textContent).toContain('Completed Task');
          done();
        });
      });
    });
  });

  describe('Delete Button', () => {
    it('should render delete button for each task', (done) => {
      const mockTasks = [
        { id: '1', title: 'Task 1', completed: false },
        { id: '2', title: 'Task 2', completed: false }
      ];
      tasksServiceSpy.getTasks.and.returnValue(of(mockTasks));

      fixture.detectChanges();

      component.tasks$.subscribe(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          const deleteButtons = fixture.nativeElement.querySelectorAll('button[icon="pi pi-trash"]');
          expect(deleteButtons.length).toBe(2);
          done();
        });
      });
    });
  });

  describe('Create Task Flow', () => {
    it('should not create task if input is empty', () => {
      component.newTask = '';
      component.createTask();
      expect(tasksServiceSpy.createTask).not.toHaveBeenCalled();
    });
  });
});