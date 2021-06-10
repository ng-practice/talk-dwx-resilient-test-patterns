import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TodosComponent } from './todos.component';
import { TodosModule } from './todos.module';
import { TodosService } from './shared/todos.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('TodosComponent', () => {
  describe('negative example using naive TestBed setup as created by CLI', () => {
    let component: TodosComponent;
    let fixture: ComponentFixture<TodosComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TodosModule, RouterTestingModule, HttpClientTestingModule],
        providers: [
          {
            provide: TodosService,
            useValue: {
              query: () =>
                of([{ text: 'test TODO 1' }, { text: 'test TODO 2' }]),
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
      const todos = fixture.debugElement.queryAll(By.css('nde-todo-checker'));
      expect(todos.length).toBe(2);
      expect(todos[0].nativeElement.textContent).toContain('test TODO 1');
      expect(todos[1].nativeElement.textContent).toContain('test TODO 2');
    });
  });
});
