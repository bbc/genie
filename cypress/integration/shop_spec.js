/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { getUrl } from "../support/functions";

describe(`The Genie Shop component ${Cypress.env("THEME")}`, () => {
    beforeEach(() => {
        cy.visit(getUrl());
        cy.get("#home__play", { timeout: 60000 }).should("exist");
        if (!Cypress.env("DEV_LOCAL") == "true") {
            cy.get(".data-notice").click();
        }
        cy.genieClick("#home__debug");
        cy.genieClick("#debug__debug-shop-demo");
        cy.genieClick("#debug-shop-demo__Shop");
    });

    it("Successfully purchase and equip an item", () => {
        cy.genieClick("#debug-shop-demo-shop__shop_menu_button");
        cy.genieClick("#debug-shop-demo-shop__scroll_button_redHat_shop");
        cy.genieClick("#debug-shop-demo-shop__tx_buy_button");
        cy.genieClick("#debug-shop-demo-shop__back");
        cy.genieClick("#debug-shop-demo-shop__manage_menu_button");
        cy.genieClick("#debug-shop-demo-shop__scroll_button_redHat_manage");
        cy.genieClick("#debug-shop-demo-shop__tx_equip_button");
    });

    it("Can pause the game throughout the shop", () => {
        cy.genieClick("#debug-shop-demo-shop__pause");
        cy.genieClick("#pause__play");
        cy.genieClick("#debug-shop-demo-shop__shop_menu_button");
        cy.genieClick("#debug-shop-demo-shop__pause");
        cy.genieClick("#pause__play");
        cy.genieClick("#debug-shop-demo-shop__back");
        cy.genieClick("#debug-shop-demo-shop__manage_menu_button");
        cy.genieClick("#debug-shop-demo-shop__pause");
        cy.genieClick("#pause__play");
    });

    it("Returns the user to the previous screen when the back button is selected", () => {
        cy.genieClick("#debug-shop-demo-shop__manage_menu_button");
        cy.genieClick("#debug-shop-demo-shop__scroll_button_ironHat_manage");
        cy.genieClick("#debug-shop-demo-shop__back");
        cy.genieClick("#debug-shop-demo-shop__back");
        cy.genieClick("#debug-shop-demo-shop__shop_menu_button");
        cy.genieClick("#debug-shop-demo-shop__back");
        cy.get("#debug-shop-demo-shop__manage_menu_button").should("exist");
    });
});
