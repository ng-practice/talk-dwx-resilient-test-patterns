import { mount } from '@jscutlery/cypress-angular/mount';
import { Todo } from '../models';
import { TodoCheckerComponent } from './todo-checker.component';

describe('greetings', () => {
  it('should say hello', () => {
    const todo: Todo = { text: 'Wow', isDone: true };

    mount(TodoCheckerComponent, {
      inputs: {
        todo,
      },
    });

    cy.contains(todo.text);
  });
});
