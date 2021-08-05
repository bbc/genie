/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { statHelper } from "games-stat-helper";
import { getUrl } from "../../support/functions";
import { pageViews } from "../../support/statConfig";

describe("Page view stats for Genie Screens", () => {
	beforeEach(() => {
		cy.intercept({
			query: {
				p: `${statHelper.formatStatConfig(pageViews.homePage).counterName}`,
			},
		}).as("homePageView");
		cy.visit(getUrl());
		cy.get("#home__play", { timeout: 60000 }).should("exist");
		if (!Cypress.env("DEV_LOCAL") == "true") {
			cy.get(".data-notice").click();
		}
	});

	it("Fires a page view stat for the home screen.", () => {
		cy.wait("@homePageView");
	});

	it("Fires a page view stat for the character select screen.", () => {
		cy.intercept({
			method: "GET",
			query: {
				p: `${statHelper.formatStatConfig(pageViews.selectScreenPage).counterName}`,
			},
		}).as("selectScreenView");
		cy.genieClick("#home__play");
		cy.genieClick("#narrative__skip");
		cy.wait("@selectScreenView");
	});

	it("Fires a page view stat for the results screen.", () => {
		cy.intercept({
			method: "GET",
			query: {
				p: `${statHelper.formatStatConfig(pageViews.resultsScreenPage).counterName}`,
			},
		}).as("resultsScreenView");
		cy.genieClick("#home__play");
		cy.genieClick("#narrative__skip");
		cy.genieClick("#character-select__mary");
		cy.genieClick("#level-select__1");
		cy.genieClick("#game__4");
		cy.wait("@resultsScreenView");
	});

	it("Fires a page view stat for the narrative screen.", () => {
		cy.intercept({
			method: "GET",
			query: {
				p: `${statHelper.formatStatConfig(pageViews.narrativePage).counterName}`,
			},
		}).as("narrativeScreen");
		cy.genieClick("#home__play");
		cy.genieClick("#narrative__skip");
		cy.genieClick("#character-select__mary");
		cy.genieClick("#level-select__1");
		cy.genieClick("#game__4");
		cy.wait("@narrativeScreen");
	});

	it("Fires a page view stat for the shop screen.", () => {
		cy.intercept({
			method: "GET",
			query: {
				p: `${statHelper.formatStatConfig(pageViews.shopPage).counterName}`,
			},
		}).as("menuScreen");
		cy.genieClick("#home__debug");
		cy.genieClick("#debug__debug-shop-equippables-menu");
		cy.wait("@menuScreen");
	});

	it("Fires a page view stat for the shop store screen.", () => {
		cy.intercept({
			method: "GET",
			query: {
				p: `${statHelper.formatStatConfig(pageViews.shopStore).counterName}`,
			},
		}).as("buyScreen");
		cy.genieClick("#home__debug");
		cy.genieClick("#debug__debug-shop-equippables-menu");
		cy.genieClick("#debug-shop-equippables-menu__shop_menu_button");
		cy.wait("@buyScreen");
	});

	it("Fires a page view stat for the shop management screen.", () => {
		cy.intercept({
			method: "GET",
			query: {
				p: `${statHelper.formatStatConfig(pageViews.shopManagement).counterName}`,
			},
		}).as("managementScreen");
		cy.genieClick("#home__debug");
		cy.genieClick("#debug__debug-shop-equippables-menu");
		cy.genieClick("#debug-shop-equippables-menu__manage_menu_button");
		cy.wait("@managementScreen");
	});
	it("Fires a page view stat for the level select screen.", () => {
		cy.intercept({
			method: "GET",
			query: {
				p: `${statHelper.formatStatConfig(pageViews.levelSelectPage).counterName}`,
			},
		}).as("selectScreenView");
		cy.genieClick("#home__play");
		cy.genieClick("#narrative__skip");
		cy.genieClick("#character-select__mary");
		cy.genieClick("#level-select__1");
		cy.wait("@selectScreenView");
	});
});
