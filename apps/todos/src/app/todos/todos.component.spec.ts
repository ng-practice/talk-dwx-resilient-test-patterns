import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TodosComponent } from './todos.component';
import { TodosModule } from './todos.module';
import { TodosService } from './shared/todos.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Todo } from './models/todo';

describe('TodosComponent', () => {
  // ⚠️ negative test example
  describe('using naive TestBed setup as created by CLI', () => {
    let component: TodosComponent;
    let fixture: ComponentFixture<TodosComponent>;

    // ⚠️ complicated setup
    // ⚠️ every test in this context has to use the same setup (because of the beforeEach)
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TodosModule, RouterTestingModule, HttpClientTestingModule],
        providers: [
          {
            provide: TodosService,
            useValue: {
              // ⚠️ no type safety
              query: () =>
                of([{ text: 'test TODO 1' }, { text: 'test TODO 2' }]),
            },
          },
          {
            provide: TodosService,
            useValue: {
              // better, but still not completely type-safe
              query: () =>
                of([
                  { text: 'test TODO 1' } as Todo,
                  { text: 'test TODO 2' } as Todo,
                ]),
            } as TodosService,
          },
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TodosComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should show todo items', () => {
      const todos = fixture.debugElement.queryAll(By.css('nde-todo-checker')); // ⚠️ using implementation detail
      expect(todos.length).toBe(2);
      expect(todos[0].nativeElement.textContent).toContain('test TODO 1');
      expect(todos[1].nativeElement.textContent).toContain('test TODO 2');
    });
  });

  // ⚠️ negative test example
  describe('using naive TestBed setup and Jest mock', () => {
    let component: TodosComponent;
    let fixture: ComponentFixture<TodosComponent>;

    const queryMock = jest.fn().mockReturnValue([]); // ⚠️ no type safety

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TodosModule, RouterTestingModule, HttpClientTestingModule],
        providers: [
          {
            provide: TodosService,
            useValue: {
              query: queryMock,
            },
          },
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TodosComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should show todo items', () => {
      expect(queryMock.mock.calls.length).toBe(1);
      expect(queryMock.mock.calls[0]).toEqual([null]);
    });
  });
});
