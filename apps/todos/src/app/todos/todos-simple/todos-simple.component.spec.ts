import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { Todo } from '@todos/shared-interfaces';
import { mockNg } from 'ng-mockito';
import { when } from 'ts-mockito';
import { TodoCheckerComponent } from '../todo-checker/todo-checker.component';
import { TodoQuickAddComponent } from '../todo-quick-add/todo-quick-add.component';
import { TodosComponent } from './todos-simple.component';

describe('TodosComponent', () => {
  describe('when testing isolated', () => {
    it('should initialize todos', async () => {
      const component = new TodosComponent();

      component.ngOnInit();

      expect(component.todos).toEqual([{ text: 'initial', isDone: false }]);
    });

    it('should add todo', async () => {
      const component = new TodosComponent();

      component.ngOnInit();
      component.addTodo({ text: 'added', isDone: false });

      expect(component.todos).toEqual([
        { text: 'initial', isDone: false },
        { text: 'added', isDone: false },
      ]);
    });
  });

  describe('when testing shallow', () => {
    it('should initialize todos', async () => {
      await render(TodosComponent, {
        declarations: [TodoCheckerComponent],
        schemas: [NO_ERRORS_SCHEMA],
      });

      expect(
        screen.getByRole('checkbox', { name: 'initial' })
      ).toBeInTheDocument();
    });

    it('should add todo', async () => {
      const { fixture, detectChanges } = await render(TodosComponent, {
        declarations: [TodoCheckerComponent],
        schemas: [NO_ERRORS_SCHEMA],
      });

      fixture.componentInstance.addTodo({ text: 'added', isDone: false });
      detectChanges();

      expect(
        screen.getByRole('checkbox', { name: 'initial' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('checkbox', { name: 'added' })
      ).toBeInTheDocument();
    });

    it('should add todo (with ng-mockito mock)', async () => {
      const create = new EventEmitter<Todo>();

      const { detectChanges } = await render(TodosComponent, {
        declarations: [
          TodoCheckerComponent,
          mockNg(TodoQuickAddComponent, (mock) =>
            when(mock.create).thenReturn(create)
          ),
        ],
      });

      create.next({ text: 'added', isDone: false });
      detectChanges();

      expect(
        screen.getByRole('checkbox', { name: 'initial' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('checkbox', { name: 'added' })
      ).toBeInTheDocument();
    });
  });

  describe('when testing with full TestBed', () => {
    it('should initialize todos', async () => {
      await render(TodosComponent, {
        declarations: [TodoCheckerComponent, TodoQuickAddComponent],
      });

      expect(
        screen.getByRole('checkbox', { name: 'initial' })
      ).toBeInTheDocument();
    });

    it('should add todo', async () => {
      await render(TodosComponent, {
        declarations: [TodoCheckerComponent, TodoQuickAddComponent],
      });

      userEvent.type(screen.getByRole('textbox'), 'added');
      userEvent.click(screen.getByRole('button', { name: 'Add' }));

      expect(
        screen.getByRole('checkbox', { name: 'initial' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('checkbox', { name: 'added' })
      ).toBeInTheDocument();
    });
  });
});
