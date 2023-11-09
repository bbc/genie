/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { getUrl } from "../../../support/functions";
import { appendToken } from "../../../support/appendToken";

describe(`The Genie Shop component ${Cypress.env("THEME")}`, () => {
	beforeEach(() => {
		cy.visit(appendToken(`${Cypress.env("url")}${getUrl()}`));
		cy.get("#home__play", { timeout: 60000 }).should("exist");
		cy.genieClick("#home__debug");
		cy.genieClick("#debug__debug-shop-equippables-menu");
	});

	it("Successfully purchase and equip an item", () => {
		cy.genieClick("#debug-shop-equippables-menu__shop_menu_button");
		cy.genieClick("#debug-shop-equippables-list__scroll_button_ironHat_shop");
		cy.genieClick("#debug-shop-equippables-confirm__tx_buy_button");
		cy.genieClick("#debug-shop-equippables-list__back");
		cy.genieClick("#debug-shop-equippables-menu__manage_menu_button");
		cy.genieClick("#debug-shop-equippables-list__scroll_button_ironHat_manage");
		cy.genieClick("#debug-shop-equippables-confirm__tx_equip_button");
	});

	it("Can pause the game throughout the shop", () => {
		cy.genieClick("#debug-shop-equippables-menu__pause");
		cy.genieClick("#pause__play");
		cy.genieClick("#debug-shop-equippables-menu__shop_menu_button");
		cy.genieClick("#debug-shop-equippables-list__pause");
		cy.genieClick("#pause__play");
		cy.genieClick("#debug-shop-equippables-list__back");
		cy.genieClick("#debug-shop-equippables-menu__manage_menu_button");
		cy.genieClick("#debug-shop-equippables-list__pause");
		cy.genieClick("#pause__play");
	});

	it("Returns the user to the previous screen when the back button is selected", () => {
		cy.genieClick("#debug-shop-equippables-menu__manage_menu_button");
		cy.genieClick("#debug-shop-equippables-list__scroll_button_box_manage");
		cy.genieClick("#debug-shop-equippables-confirm__back");
		cy.genieClick("#debug-shop-equippables-list__back");
		cy.genieClick("#debug-shop-equippables-menu__shop_menu_button");
		cy.genieClick("#debug-shop-equippables-list__back");
		cy.get("#debug-shop-equippables-menu__manage_menu_button").should("exist");
	});
});
