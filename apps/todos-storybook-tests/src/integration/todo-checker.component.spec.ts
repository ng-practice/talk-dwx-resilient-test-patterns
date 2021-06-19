describe('TodoCheckerComponent', () => {
  it('should show todo item', () => {
    cy.visit('/iframe.html?id=todocheckercomponent--primary');

    cy.findByRole('checkbox', { name: 'Wow' })
      .should('exist')
      .and('be.checked');
  });
});
