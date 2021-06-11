import { getGreeting } from '../support/app.po';

describe('todo app', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display title (using page object)', () => {
    getGreeting().contains('todos');
  });

  it('should display title (using testing-library -> findByRole)', () => {
    cy.findByRole('heading').should('have.text', 'todos');
  });

  it('should display title (using testing-library -> findByTestId)', () => {
    cy.findByTestId('app-heading').should('have.text', 'todos');
  });
});
