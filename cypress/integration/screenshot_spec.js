/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { getUrl } from "../support/functions";

const sizes = ["iphone-5", "iphone-7", [1400, 600]];
const theme = Cypress.env("THEME");
const screenshotData = (size, text) => {
    return `[${size} ${theme} ${text}]`;
};

describe(`Takes screenshots on multiple viewports ${Cypress.env("THEME")}`, () => {
    sizes.forEach(size => {
        it(`screenshots each screen on the core game flow screens on a ${size} viewport`, () => {
            if (Cypress._.isArray(size)) {
                cy.viewport(size[0], size[1], "landscape");
            } else {
                cy.viewport(size, "landscape");
            }
            cy.visit(getUrl());
            cy.get("#home__play", { timeout: 40000 }).should("exist");
            if (!Cypress.env("DEV_LOCAL") == "true") {
                cy.get(".data-notice").click();
            }
            cy.safeArea("#home__play");
            cy.get("canvas").screenshot(screenshotData(size, "Home Screen"), { capture: "viewport", timeout: "20000" });
            cy.genieClick("#home__how-to-play");
            cy.safeArea("#how-to-play__back");
            cy.get("canvas").screenshot(screenshotData(size, "How To Play Screen"), {
                capture: "viewport",
                timeout: "20000",
            });
            cy.genieClick("#how-to-play__back");
            cy.genieClick("#home__play");
            cy.safeArea("#narrative__continue");
            cy.get("canvas").screenshot(screenshotData(size, "Narrative Screen"), {
                capture: "viewport",
                timeout: "20000",
            });
            cy.genieClick("#narrative__pause");
            cy.safeArea("#pause__play");
            cy.get("canvas").screenshot(screenshotData(size, "Pause Screen"), {
                capture: "viewport",
                timeout: "20000",
            });
            cy.genieClick("#pause__play");
            cy.genieClick("#narrative__continue");
            cy.genieClick("#narrative__continue");
            cy.genieClick("#narrative__continue");
            cy.genieClick("#character-select__phil");
            cy.safeArea("#level-select__1");
            cy.get("canvas").screenshot(screenshotData(size, "Level Select Screen"), {
                capture: "viewport",
                timeout: "20000",
            });
            cy.genieClick("#level-select__1");
            cy.genieClick("#game__4");
            cy.safeArea("#results__continue");
            cy.get("canvas").screenshot(screenshotData(size, "Results Screen"), {
                capture: "viewport",
                timeout: "20000",
            });
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
            cy.get("canvas").screenshot(screenshotData(size, "Select Screen Single Item"), {
                capture: "viewport",
                timeout: "20000",
            });
        });

        /* Temporarily removed until bug fix is introduced */

        // it(`screenshots the shop screens on a ${size} viewport`, () => {
        //     if (Cypress._.isArray(size)) {
        //         cy.viewport(size[0], size[1], "landscape");
        //     } else {
        //         cy.viewport(size, "landscape");
        //     }
        //     cy.visit(getUrl());
        //     cy.get("#home__play", { timeout: 40000 }).should("exist");
        //     cy.genieClick("#home__debug");
        //     cy.genieClick("#debug__debug-shop-demo");
        //     cy.genieClick("#debug-shop-demo__Shop");
        //     cy.safeArea("#debug-shop-demo-shop__shop_menu_button");
        //     cy.get("canvas").screenshot(screenshotData(size, "Shop front Screen"), {
        //         capture: "viewport",
        //         timeout: "20000",
        //     });
        //     cy.genieClick("#debug-shop-demo-shop__shop_menu_button");
        //     cy.safeArea("#debug-shop-demo-shop__back");
        //     cy.get("canvas").screenshot(screenshotData(size, "Shop management Screen"), {
        //         capture: "viewport",
        //         timeout: "20000",
        //     });
        //     cy.genieClick("#debug-shop-demo-shop__back");
        //     cy.genieClick("#debug-shop-demo-shop__shop_menu_button");
        //     cy.safeArea("#debug-shop-demo-shop__back");
        //     cy.get("canvas").screenshot(screenshotData(size, "Shop store Screen"), {
        //         capture: "viewport",
        //         timeout: "20000",
        //     });
        // });
    });
});
