/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
Cypress.Commands.add("genieClick", selector => {
	return cy.get(selector).should("exist").focus().type("{enter}", { force: true });
});

Cypress.Commands.add("safeArea", selector => {
	return cy.get("canvas").focus().type("Q", { force: true }) && cy.get(selector).should("exist");
});

Cypress.Commands.add("ariaHidden", (selector, isHidden) => {
	return cy.get(selector).should("have.attr", "aria-hidden", `${isHidden}`);
});
