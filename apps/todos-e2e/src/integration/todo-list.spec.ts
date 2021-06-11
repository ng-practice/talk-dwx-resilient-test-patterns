import { getGreeting } from '../support/app.po';

describe('todo list', () => {
  it('should show todo items', () => {
    cy.intercept('/api?query=all', {
      body: [{ text: 'test TODO 1' }, { text: 'test TODO 2' }],
    });
    cy.visit('/');

    getGreeting().contains('todos');
  });
});
