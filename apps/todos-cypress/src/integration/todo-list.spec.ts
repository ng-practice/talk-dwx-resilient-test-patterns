describe('todo list', () => {
  it('should show todo items', () => {
    cy.intercept('/api?query=all', {
      body: [
        {
          text: 'test TODO 1',
          isDone: false,
          id: 1,
        },
        {
          text: 'test TODO 2',
          isDone: true,
          id: 2,
        },
      ],
    });
    cy.visit('/');

    cy.findAllByRole('checkbox').should('have.length', 2);
    cy.findByRole('checkbox', { name: 'test TODO 1' })
      .should('exist')
      .and('not.be.checked');
    cy.findByRole('checkbox', { name: 'test TODO 2' })
      .should('exist')
      .and('be.checked');
  });

  it('should show how many todo items are left', () => {
    cy.intercept('/api?query=all', {
      body: [
        {
          text: 'test TODO 1',
          isDone: false,
          id: 1,
        },
        {
          text: 'test TODO 2',
          isDone: false,
          id: 2,
        },
      ],
    });
    cy.intercept('PUT', '/api/2', {
      body: {
        text: 'test TODO 2',
        isDone: true,
        id: 2,
      },
    });
    cy.visit('/');

    cy.findByTestId('todo-counter').should('contain.text', '2Item(s) left');

    cy.intercept('/api?query=all', {
      body: [
        {
          text: 'test TODO 1',
          isDone: false,
          id: 1,
        },
        {
          text: 'test TODO 2',
          isDone: true,
          id: 2,
        },
      ],
    });
    cy.findByText('test TODO 2').click();
    cy.findByTestId('todo-counter').should('contain.text', '1Item(s) left');
  });

  it('should add todo item', () => {
    cy.intercept('/api?query=all', {
      body: [],
    });
    cy.intercept('POST', '/api', {
      body: [],
    }).as('add');
    cy.visit('/');

    cy.findAllByRole('checkbox').should('have.length', 0);

    cy.findByRole('textbox').type('give DWX talk');
    cy.findByRole('button', { name: /add/i }).click();
    cy.wait('@add').its('request.body').should('deep.equal', {
      text: 'give DWX talk',
      isDone: false,
    });
  });
});
