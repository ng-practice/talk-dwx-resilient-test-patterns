import { getGreeting } from '../support/app.po';

describe('todos', () => {
  beforeEach(() => cy.visit('/'));

  it('should display title', () => {
    getGreeting().contains('todos');
  });
});
