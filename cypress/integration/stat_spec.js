import { formatStatConfig } from "../support/functions";
import { getUrl } from "../support/functions";
import { statSpec } from "../support/statConfig";

describe("Stats for the Exit tile", () => {
    beforeEach(() => {
        cy.intercept('gameloaded').as("gameStat");
        cy.intercept(`howtoplay~click`).as("htpClick");
        cy.intercept(`play~click`).as("playClick");
        cy.visit(getUrl());
        cy.get("#home__play", { timeout: 60000 }).should("exist");
        if (!Cypress.env("DEV_LOCAL") == "true") {
            cy.get(".data-notice").click();
        }
    });

    it("Fires a stat when the game is loaded", () => {
        cy.wait("@gameStat").then(interception => {
            cy.log(interception).its(`response.url`).should("include", formatStatConfig(statSpec.gameloaded).stat);
        })
    });

    it("Fires a click event when the play button is clicked", () => {
        cy.genieClick("#home__play");
        cy.wait("@playClick").then(interception => {
            cy.log(interception).its(`response.url`).should("include", formatStatConfig(statSpec.clickPlay).stat);
        })
    });

    it("Fires a click event when the how to play button is clicked", () => {
        cy.genieClick("#home__how-to-play");
        cy.wait("@htpClick").then(interception => {
            cy.log(interception).its(`response.url`).should("include", formatStatConfig(statSpec.clickHowtoplay).stat);
        })
    });
});
