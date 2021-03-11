/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { getUrl } from "../support/functions";

describe(`The Select screens ${Cypress.env("THEME")}`, () => {
    beforeEach(() => {
        cy.visit(getUrl());
        cy.get("#home__play", { timeout: 60000 }).should("exist");
        if (!Cypress.env("DEV_LOCAL") == "true") {
            cy.get(".data-notice").click();
        }
    });

    it("Continuously scrolls through the character select on single item", () => {
        cy.genieClick("#home__debug");
        cy.genieClick("#debug__debug-select-1");
        cy.get("#debug-select-1__mary").tab();
        cy.focused().should("have.id", "debug-select-1__kyle");
        cy.get("#debug-select-1__kyle").tab();
        cy.focused().should("have.id", "debug-select-1__suzy");
        cy.get("#debug-select-1__suzy").tab();
        cy.focused().should("have.id", "debug-select-1__greg");
        cy.get("#debug-select-1__greg").tab();
        cy.focused().should("have.id", "debug-select-1__ezinma");
        cy.get("#debug-select-1__ezinma").tab();
        cy.focused().should("have.id", "debug-select-1__phil");
        cy.get("#debug-select-1__phil").tab();
        cy.focused().should("have.id", "debug-select-1__mike");
        cy.get("#debug-select-1__mike").tab();
        cy.focused().should("have.id", "debug-select-1__debby");
        cy.get("#debug-select-1__debby").tab();
        cy.focused().should("have.id", "debug-select-1__timmy");
        cy.get("#debug-select-1__timmy").tab();
        cy.focused().should("have.id", "debug-select-1__elliot");
        cy.get("#debug-select-1__elliot").tab();
        cy.focused().should("have.id", "debug-select-1__home");
        cy.get("#debug-select-1__home").tab();
        cy.focused().should("have.id", "debug-select-1__pause");
        cy.get("#debug-select-1__pause").tab();
        cy.focused().should("have.id", "debug-select-1__mary");
    });

    it("Displays up to 6 characters at once per page", () => {
        cy.genieClick("#home__debug");
        cy.genieClick("#debug__debug-select-grid");
        cy.ariaHidden("#debug-select-grid__mary", "false");
        cy.ariaHidden("#debug-select-grid__kyle", "false");
        cy.ariaHidden("#debug-select-grid__suzy", "false");
        cy.ariaHidden("#debug-select-grid__greg", "false");
        cy.ariaHidden("#debug-select-grid__ezinma", "false");
        cy.ariaHidden("#debug-select-grid__phil", "false");
        cy.ariaHidden("#debug-select-grid__mike", "true");
        cy.ariaHidden("#debug-select-grid__debby", "true");
        cy.ariaHidden("#debug-select-grid__timmy", "true");
        cy.ariaHidden("#debug-select-grid__elliot", "true");
        cy.genieClick("#debug-select-grid__next").wait(2000);
        cy.ariaHidden("#debug-select-grid__mary", "true");
        cy.ariaHidden("#debug-select-grid__kyle", "true");
        cy.ariaHidden("#debug-select-grid__suzy", "true");
        cy.ariaHidden("#debug-select-grid__greg", "true");
        cy.ariaHidden("#debug-select-grid__ezinma", "true");
        cy.ariaHidden("#debug-select-grid__phil", "true");
        cy.ariaHidden("#debug-select-grid__mike", "false");
        cy.ariaHidden("#debug-select-grid__debby", "false");
        cy.ariaHidden("#debug-select-grid__timmy", "false");
        cy.ariaHidden("#debug-select-grid__elliot", "false");
    });

    it("Continuously cycles through select pages on grid view", () => {
        cy.genieClick("#home__debug");
        cy.genieClick("#debug__debug-select-grid").wait(2000);
        cy.ariaHidden("#debug-select-grid__mary", "false");
        cy.ariaHidden("#debug-select-grid__mike", "true");
        cy.genieClick("#debug-select-grid__next").wait(2000);
        cy.ariaHidden("#debug-select-grid__mary", "true");
        cy.ariaHidden("#debug-select-grid__mike", "false");
        cy.genieClick("#debug-select-grid__next").wait(2000);
        cy.ariaHidden("#debug-select-grid__mary", "false");
        cy.ariaHidden("#debug-select-grid__mike", "true");
        cy.genieClick("#debug-select-grid__previous").wait(2000);
        cy.ariaHidden("#debug-select-grid__mary", "true");
        cy.ariaHidden("#debug-select-grid__mike", "false");
        cy.genieClick("#debug-select-grid__previous").wait(2000);
        cy.ariaHidden("#debug-select-grid__mary", "false");
        cy.ariaHidden("#debug-select-grid__mike", "true");
        cy.genieClick("#debug-select-grid__previous").wait(2000);
        cy.ariaHidden("#debug-select-grid__mary", "true");
        cy.ariaHidden("#debug-select-grid__mike", "false");
    });
});
