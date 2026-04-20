import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { Tasks } from './tasks';
import { TasksService } from '../tasks.service';

describe('Tasks Integration', () => {
  let component: Tasks;
  let fixture: ComponentFixture<Tasks>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tasks, CommonModule, FormsModule, HttpClientTestingModule],
      providers: [TasksService]
    }).compileComponents();

    fixture = TestBed.createComponent(Tasks);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // it('should load and display tasks', () => {
  //   const mockTasks = [{ id: '1', title: 'Test Task', completed: false }];

  //   // 1. O ngOnInit ou a inicialização do componente dispara o GET
  //   fixture.detectChanges(); 

  //   // 2. Você PRECISA capturar essa requisição que ficou aberta
  //   const req = httpMock.expectOne('http://localhost:3000/tasks');
    
  //   // 3. E você PRECISA dar um fim nela com o flush
  //   req.flush(mockTasks);

  //   // Agora, ao chegar no afterEach, o verify() verá que não há nada pendente.
  //   component.tasks$.pipe(take(1)).subscribe(tasks => {
  //     expect(tasks).toEqual(mockTasks);
  //   });
  // });

  it('should create a new task', (done) => {
    fixture.detectChanges();

    // First request for initial load
    const initialReq = httpMock.expectOne('http://localhost:3000/tasks');
    initialReq.flush([]);

    component.newTask = 'New Task';
    component.createTask();

    // Second request for creating task
    const createReq = httpMock.expectOne('http://localhost:3000/tasks');
    expect(createReq.request.method).toBe('POST');
    expect(createReq.request.body).toEqual({ title: 'New Task' });
    createReq.flush({ id: '2', title: 'New Task' });

    fixture.detectChanges();

    // Third request for reload
    const reloadReq = httpMock.expectOne('http://localhost:3000/tasks');
    reloadReq.flush([{ id: '2', title: 'New Task' }]);

    fixture.whenStable().then(() => {
      expect(component.newTask).toBe('');
      done();
    });
  });

  it('should toggle task completion', (done) => {
    fixture.detectChanges();

    // Initial load request
    const initialReq = httpMock.expectOne('http://localhost:3000/tasks');
    initialReq.flush([{ id: '1', completed: false }]);

    const task = { id: '1', completed: false };
    component.toggleTask(task);

    // Update request
    const updateReq = httpMock.expectOne('http://localhost:3000/tasks/1');
    expect(updateReq.request.method).toBe('PATCH');
    expect(updateReq.request.body).toEqual({ completed: true });
    updateReq.flush({ ...task, completed: true });

    // Reload request
    const reloadReq = httpMock.expectOne('http://localhost:3000/tasks');
    reloadReq.flush([{ id: '1', completed: true }]);

    fixture.whenStable().then(() => {
      done();
    });
  });

  it('should delete a task', (done) => {
    fixture.detectChanges();

    // Initial load request
    const initialReq = httpMock.expectOne('http://localhost:3000/tasks');
    initialReq.flush([{ id: '1', title: 'Task to delete' }]);

    const task = { id: '1' };
    component.deleteTask(task);

    // Delete request
    const deleteReq = httpMock.expectOne('http://localhost:3000/tasks/1');
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush(null);

    // Reload request
    const reloadReq = httpMock.expectOne('http://localhost:3000/tasks');
    reloadReq.flush([]);

    fixture.whenStable().then(() => {
      done();
    });
  });
});