
/* eslint-disable no-undef */

describe('testfile-04', () => {
    it('should navigate to parenrUntil', () => {
        cy.visit('https://example.cypress.io');
        cy.get('.container .home-list').contains('eq').click();
        cy.url().should('include', 'https://example.cypress.io/commands/traversal');
    });
});
