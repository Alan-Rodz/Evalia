/// <reference types='cypress' />

// ********************************************************************************
// == Util ========================================================================
Cypress.Commands.add('getButtonContains', (text: string) => cy.get(`button:contains('${text}')`));
Cypress.Commands.add('getByAriaLabel', (label: string) => cy.get(`[aria-label='${label}']`));
Cypress.Commands.add('getById', (id: string) => cy.get(`[id='${id}']`));
Cypress.Commands.add('getByInputName', (name: string) => cy.get(`input[name='${name}']`));
Cypress.Commands.add('getByInputPlaceholder', (placeholder: string) => cy.get(`input[placeholder='${placeholder}']`));
Cypress.Commands.add('getBySpanContains', (text: string) => cy.get(`span:contains('${text}')`));
Cypress.Commands.add('getByParagraphContains', (text: string) => cy.get(`p:contains('${text}')`));
Cypress.Commands.add('getBySelectName', (name: string) => cy.get(`select[name='${name}']`));
Cypress.Commands.add('getByTextAreaName', (name: string) => cy.get(`textarea[name='${name}']`));
Cypress.Commands.add('getByTextAreaPlaceholder', (placeholder: string) => cy.get(`textarea[placeholder='${placeholder}']`));
Cypress.Commands.add('getFirstClassNameContains', (className: string) => cy.get(`[class*='${className}']`).first());
Cypress.Commands.add('getOptionContains', (text: string) => cy.get(`option:contains('${text}')`));
