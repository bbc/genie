/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("genieClick", selector => {
    return cy.get(selector).should("exist").type("{enter}", { force: true });
});

Cypress.Commands.add("safeArea", selector => {
    return cy.get(selector).should("exist").type("Q", { force: true });
});

Cypress.Commands.add("ariaHidden", (selector, isHidden) => {
    return cy.get(selector).should("have.attr", "aria-hidden", `${isHidden}`);
});

// -- This is a child command --
// Cypress.Commands.add("example", { prevSubject: 'element'}, (subject, options) => {

// })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
