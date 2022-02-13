describe('AutocompleteComponent', () => {
  before(() => cy.visitStorybook());

  beforeEach(() => cy.loadStory('atoms/forms/autocomplete', 'Basic'));

  it(
    'when I give focus to the input ' +
      'and I type "r"' +
      'then I have two options shown = [Soren, Bernard]' +
      'and when I click on "Soren"' +
      'then the options list is hidden and "Soren" is in the input',
    () => {
      cy.get('gro-autocomplete .gro-input').focus();
      cy.get('gro-autocomplete .gro-autocomplete-options').should('exist');
      cy.get('gro-autocomplete .gro-autocomplete-options .gro-option').should(
        'have.length',
        3
      );

      cy.get('gro-autocomplete .gro-input').type('r');
      cy.get('gro-autocomplete .gro-autocomplete-options .gro-option').should(
        'have.length',
        2
      );
      cy.get(
        'gro-autocomplete .gro-autocomplete-options .gro-option:contains("Soren")'
      ).should('exist');
      cy.get(
        'gro-autocomplete .gro-autocomplete-options .gro-option:contains("Bernard")'
      ).should('exist');

      cy.get(
        'gro-autocomplete .gro-autocomplete-options .gro-option:contains("Soren")'
      ).click();
      cy.get('gro-autocomplete .gro-autocomplete-options').should('not.exist');
      cy.get('gro-autocomplete .gro-input').should('have.value', 'Soren');

      cy.get('gro-autocomplete .gro-input').focus();
      cy.get(
        'gro-autocomplete .gro-autocomplete-options .gro-option:contains("Soren")'
      ).should('have.class', 'gro-selected');
    }
  );
});
