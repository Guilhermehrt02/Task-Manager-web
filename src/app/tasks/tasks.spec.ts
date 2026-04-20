import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TasksService]
    });
    service = TestBed.inject(TasksService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTasks', () => {
    it('should make a GET request to retrieve tasks', () => {
      const mockTasks = [{ id: '1', title: 'Test Task' }];

      service.getTasks().subscribe(tasks => {
        expect(tasks).toEqual(mockTasks);
      });

      const req = httpMock.expectOne('http://localhost:3000/tasks');
      expect(req.request.method).toBe('GET');
      req.flush(mockTasks);
    });
  });

  describe('createTask', () => {
    it('should make a POST request to create a task', () => {
      const newTask = { title: 'New Task' };
      const mockResponse = { id: '2', ...newTask };

      service.createTask(newTask).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:3000/tasks');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTask);
      req.flush(mockResponse);
    });
  });

  describe('updateTask', () => {
    it('should make a PATCH request to update a task', () => {
      const taskId = '1';
      const updateData = { title: 'Updated Task' };
      const mockResponse = { id: taskId, ...updateData };

      service.updateTask(taskId, updateData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`http://localhost:3000/tasks/${taskId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockResponse);
    });
  });

  describe('deleteTask', () => {
    it('should make a DELETE request and return the deleted task object', () => {
      const taskId = '1';
      const mockDeletedTask = { id: taskId, title: 'Test Task' };

      service.deleteTask(taskId).subscribe(response => {
        expect(response).toEqual(mockDeletedTask);
      });

      const req = httpMock.expectOne(`http://localhost:3000/tasks/${taskId}`);
      expect(req.request.method).toBe('DELETE');

      req.flush(mockDeletedTask); 
    });
  });
});