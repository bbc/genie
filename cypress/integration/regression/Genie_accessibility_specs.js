import { getUrl } from "../support/functions";

describe(`Tests the accessibility navigation genie debug flow ${Cypress.env("THEME")}`, () => {
	const checkHomeScreen = () => {
		cy.get("#home__play").should("exist");
		cy.get("#home__exit").should("exist");
		cy.get("#home__settings").should("exist");
		cy.get("#home__how-to-play").should("exist");
		cy.get("#home__achievements").should("exist");
		cy.genieClick("#home__play");
	};
});