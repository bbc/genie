/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import {
    getUrl
  } from "../support/functions";


const sizes = ["iphone-5", "iphone-7", [1400, 600]];

describe("Takes screenshots on multiple viewports", () => {
    sizes.forEach(size => {
        it(`screenshots each screen on the core game flow screens on a ${size} viewport`, () => {
            if (Cypress._.isArray(size)) {
                cy.viewport(size[0], size[1], "landscape");
            } else {
                cy.viewport(size, "landscape");
            }
            cy.visit(getUrl());
            cy.get("#home__play", { timeout: 40000 }).should("exist");
            cy.get(".data-notice").click();
            cy.safeArea("#home__play");
            cy.get("#game-holder").screenshot(`[${size}] Home Screen`, { capture: "viewport" });
            cy.genieClick("#home__how-to-play");
            cy.safeArea("#how-to-play__back");
            cy.get("#game-holder").screenshot(`[${size}] How To Play Screen`, { capture: "viewport" });
            cy.genieClick("#how-to-play__back");
            cy.genieClick("#home__play");
            cy.safeArea("#narrative__continue");
            cy.get("#game-holder").screenshot(`[${size}] Narrative Screen`, { capture: "viewport" });
            cy.genieClick("#narrative__pause");
            cy.safeArea("#pause__play");
            cy.get("#game-holder").screenshot(`[${size}] Pause Screen`, { capture: "viewport" });
            cy.genieClick("#pause__play");
            cy.genieClick("#narrative__continue");
            cy.genieClick("#narrative__continue");
            cy.genieClick("#narrative__continue");
            cy.genieClick("#character-select__phil");
            cy.safeArea("#level-select__1");
            cy.get("#game-holder").screenshot(`[${size}] Level Select Screen`, { capture: "viewport" });
            cy.genieClick("#level-select__1");
            cy.genieClick("#game__4");
            cy.safeArea("#results__continue");
            cy.get("#game-holder").screenshot(`[${size}] Results Screen`, { capture: "viewport" });
        });

        it(`screenshots the single item select screen on a ${size} viewport`, () => {
            if (Cypress._.isArray(size)) {
                cy.viewport(size[0], size[1], "landscape");
            } else {
                cy.viewport(size, "landscape");
            }
            cy.visit(getUrl());
            cy.get("#home__play", { timeout: 40000 }).should("exist");
            cy.genieClick("#home__debug");
            cy.genieClick("#debug__debug-select-1");
            cy.ariaHidden("#debug-select-1__mary", "false");
            cy.safeArea("#debug-select-1__mary");
            cy.get("#game-holder").screenshot(`[${size}] Select Screen Single Item`, { capture: "viewport" });
        });

        it(`screenshots the shop screens on a ${size} viewport`, () => {
            if (Cypress._.isArray(size)) {
                cy.viewport(size[0], size[1], "landscape");
            } else {
                cy.viewport(size, "landscape");
            }
            cy.visit(getUrl());
            cy.get("#home__play", { timeout: 40000 }).should("exist");
            cy.genieClick("#home__debug");
            cy.genieClick("#debug__debug-shop-demo");
            cy.genieClick("#debug-shop-demo__Shop");
            cy.safeArea("#debug-shop-demo-shop__shop_menu_button");
            cy.get("#game-holder").screenshot(`[${size}] Shop front Screen `, { capture: "viewport" });
            cy.genieClick("#debug-shop-demo-shop__shop_menu_button");
            cy.safeArea("#debug-shop-demo-shop__back");
            cy.get("#game-holder").screenshot(`[${size}] Shop management Screen `, { capture: "viewport" });
            cy.genieClick("#debug-shop-demo-shop__back");
            cy.genieClick("#debug-shop-demo-shop__shop_menu_button");
            cy.safeArea("#debug-shop-demo-shop__back");
            cy.get("#game-holder").screenshot(`[${size}] Shop store Screen `, { capture: "viewport" });
        });
    });
});
