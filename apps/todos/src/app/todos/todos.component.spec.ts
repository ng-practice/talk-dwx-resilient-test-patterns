import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { render, screen } from '@testing-library/angular';
import { mockNg, mockProvider } from 'ng-mockito';
import { mockToken } from 'ng-mockito/lib/mock-token';
import { NEVER, of } from 'rxjs';
import { anyString, capture, instance, mock, verify, when } from 'ts-mockito';
import { Todo } from './models/todo';
import { TodosService } from './shared/todos.service';
import { TodosComponent } from './todos.component';
import { TodosModule } from './todos.module';
import { APP_TITLE } from './tokens';

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
              query: () => of([{ text: 'test TODO 1' }, { text: 'test TODO 2' }]),
            },
          },
          {
            provide: TodosService,
            useValue: {
              // better, but still not completely type-safe
              query: () => of([{ text: 'test TODO 1' } as Todo, { text: 'test TODO 2' } as Todo]),
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

    it('should query todo items', () => {
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

    it('should query todo items', () => {
      expect(queryMock.mock.calls.length).toBe(1);
      expect(queryMock.mock.calls[0]).toEqual([null]);
    });
  });

  describe('using naive TestBed setup and ts-mockito', () => {
    let component: TodosComponent;
    let fixture: ComponentFixture<TodosComponent>;

    let mockTodosService = mock(TodosService); // has type TodosService
    let mockActivatedRoute = mock(ActivatedRoute); // has type ActivatedRoute

    beforeEach(async () => {
      when(mockTodosService.query(anyString())).thenReturn(of([]));
      when(mockActivatedRoute.paramMap).thenReturn(
        of(
          convertToParamMap({
            query: 'all',
          })
        )
      );
      when(mockActivatedRoute.snapshot).thenReturn(
        {} as ActivatedRouteSnapshot // needed because RouterTestingModule depends on it...
      );

      await TestBed.configureTestingModule({
        imports: [TodosModule, RouterTestingModule],
        providers: [
          {
            provide: TodosService,
            useFactory: () => instance(mockTodosService), // has type TodosService
          },
          {
            provide: ActivatedRoute,
            useFactory: () => instance(mockActivatedRoute),
          },
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TodosComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should query todo items', () => {
      verify(mockTodosService.query('all')).called();

      const [param] = capture(mockTodosService.query).first();
      expect(param).toEqual('all');
    });
  });

  describe('using testing-library and ts-mockito', () => {
    it('should query todo items', async () => {
      let mockTodosService = mock(TodosService); // has type TodosService
      let mockActivatedRoute = mock(ActivatedRoute); // has type ActivatedRoute

      when(mockTodosService.query(anyString())).thenReturn(of([]));
      when(mockActivatedRoute.paramMap).thenReturn(
        of(
          convertToParamMap({
            query: 'all',
          })
        )
      );
      when(mockActivatedRoute.snapshot).thenReturn(
        {} as ActivatedRouteSnapshot // needed because RouterTestingModule depends on it...
      );

      await render(TodosComponent, {
        imports: [TodosModule, RouterTestingModule],
        providers: [
          {
            provide: TodosService,
            useFactory: () => instance(mockTodosService), // has type TodosService
          },
          {
            provide: ActivatedRoute,
            useFactory: () => instance(mockActivatedRoute),
          },
        ],
        excludeComponentDeclaration: true,
      });

      verify(mockTodosService.query('all')).called();

      const [param] = capture(mockTodosService.query).first();
      expect(param).toEqual('all');
    });

    it('should show app title', async () => {
      let mockTodosService = mock(TodosService); // has type TodosService
      let mockActivatedRoute = mock(ActivatedRoute); // has type ActivatedRoute

      when(mockTodosService.query(anyString())).thenReturn(NEVER);
      when(mockActivatedRoute.paramMap).thenReturn(NEVER);
      when(mockActivatedRoute.snapshot).thenReturn(
        {} as ActivatedRouteSnapshot // needed because RouterTestingModule depends on it...
      );

      await render(TodosComponent, {
        imports: [TodosModule, RouterTestingModule],
        providers: [
          {
            provide: TodosService,
            useFactory: () => instance(mockTodosService),
          },
          {
            provide: ActivatedRoute,
            useFactory: () => instance(mockActivatedRoute),
          },
          {
            provide: APP_TITLE,
            useFactory: () => 'Test Heading', // ⚠️ no type safety --> see ng-mockito example
          },
        ],
        excludeComponentDeclaration: true,
      });

      expect(screen.getByRole('heading')).toHaveTextContent('Test Heading');
    });
  });

  describe('using testing-library and ts-mockito (shallow)', () => {
    it('should query todo items', async () => {
      let mockTodosService = mock(TodosService); // has type TodosService
      let mockActivatedRoute = mock(ActivatedRoute); // has type ActivatedRoute

      when(mockTodosService.query(anyString())).thenReturn(of([]));
      when(mockActivatedRoute.paramMap).thenReturn(
        of(
          convertToParamMap({
            query: 'all',
          })
        )
      );
      await render(TodosComponent, {
        providers: [
          {
            provide: TodosService,
            useFactory: () => instance(mockTodosService), // has type TodosService
          },
          {
            provide: ActivatedRoute,
            useFactory: () => instance(mockActivatedRoute),
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      });

      verify(mockTodosService.query('all')).called();

      const [param] = capture(mockTodosService.query).first();
      expect(param).toEqual('all');
    });

    // it('should show app title') is the same as above
  });

  describe('using testing-library and ng-mockito (shallow)', () => {
    it('should query todo items', async () => {
      let mockTodosService = mock(TodosService); // has type TodosService

      await render(TodosComponent, {
        providers: [
          mockProvider(mockTodosService, (mock) => when(mock.query(anyString())).thenReturn(of([]))),
          mockProvider(ActivatedRoute, (mock) =>
            when(mock.paramMap).thenReturn(
              of(
                convertToParamMap({
                  query: 'all',
                })
              )
            )
          ),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      });

      verify(mockTodosService.query('all')).called();

      const [param] = capture(mockTodosService.query).first();
      expect(param).toEqual('all');
    });

    it('should show app title', async () => {
      let mockTodosService = mock(TodosService); // has type TodosService

      await render(TodosComponent, {
        providers: [
          mockNg(mockTodosService, (mock) => when(mock.query(anyString())).thenReturn(NEVER)),
          mockNg(ActivatedRoute, (mock) => when(mock.paramMap).thenReturn(NEVER)),
          mockNg([APP_TITLE, TodosComponent], {
            use: 'Test Heading' /* type-safe */,
          }),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      });

      expect(screen.getByRole('heading')).toHaveTextContent('Test Heading');
    });
  });

  describe('using ts-mockito (isolated)', () => {
    it('should query todo items', async () => {
      let mockTodosService = mock(TodosService); // has type TodosService
      let mockActivatedRoute = mock(ActivatedRoute); // has type ActivatedRoute

      when(mockTodosService.query(anyString())).thenReturn(of([]));
      when(mockActivatedRoute.paramMap).thenReturn(
        of(
          convertToParamMap({
            query: 'all',
          })
        )
      );

      const component = new TodosComponent(instance(mockTodosService), instance(mockActivatedRoute), '');

      component.ngOnInit();

      verify(mockTodosService.query('all')).called();

      const [param] = capture(mockTodosService.query).first();
      expect(param).toEqual('all');
    });
  });
});
