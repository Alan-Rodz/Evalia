/// <reference types="cypress" />

// ********************************************************************************
declare namespace Cypress {
 interface Chainable {
  getButtonContains(text: string): Chainable;
  getByAriaLabel(label: string): Chainable;
  getById(id: string): Chainable;
  getByInputName(name: string): Chainable;
  getByInputPlaceholder(placeholder: string): Chainable;
  getByParagraphContains(text: string): Chainable;
  getBySpanContains(text: string): Chainable;
  getBySelectName(name: string): Chainable;
  getByTextAreaName(name: string): Chainable;
  getByTextAreaPlaceholder(placeholder: string): Chainable;
  getFirstClassNameContains(className: string): Chainable;
  getOptionContains(text: string): Chainable;
 }
}
