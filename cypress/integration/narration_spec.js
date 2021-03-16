/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { getUrl } from "../support/functions";

describe(`The Genie narration page ${Cypress.env("THEME")}`, () => {
    beforeEach(() => {
        cy.visit(getUrl());
        cy.get("#home__play", { timeout: 60000 }).should("exist");
        if (!Cypress.env("DEV_LOCAL") == "true") {
            cy.get(".data-notice").click();
        }
    });

    it("can skip the narration page", () => {
        cy.genieClick("#home__debug");
        cy.genieClick("#debug__debug-narrative");
        cy.genieClick("#debug-narrative__skip");
        cy.get("#debug__debug-narrative", { timeout: 20000 }).should("exist");
    });

    it("can proceed through each narration page", () => {
        cy.genieClick("#home__debug");
        cy.genieClick("#debug__debug-narrative");
        cy.genieClick("#debug-narrative__continue");
        cy.genieClick("#debug-narrative__continue");
        cy.genieClick("#debug-narrative__continue");
        cy.genieClick("#debug-narrative__continue");
        cy.genieClick("#debug-narrative__continue");
        cy.get("#debug__debug-narrative", { timeout: 20000 }).should("exist");
    });

    it("can pause the game on the narration page", () => {
        cy.genieClick("#home__debug");
        cy.genieClick("#debug__debug-narrative");
        cy.genieClick("#debug-narrative__pause");
        cy.genieClick("#pause__play");
        cy.get("#debug-narrative__continue").should("exist");
        cy.get("#debug-narrative__skip").should("exist");
        cy.get("#debug-narrative__pause").should("exist");
    });
});
