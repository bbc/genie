/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getUrl } from "../support/functions";

describe(`Tests the core flow of Genie ${Cypress.env("THEME")}`, () => {
	const checkHomeScreen = () => {
		cy.get("#home__play").should("exist");
		cy.get("#home__exit").should("exist");
		cy.get("#home__settings").should("exist");
		cy.get("#home__how-to-play").should("exist");
		cy.get("#home__achievements").should("exist");
		cy.genieClick("#home__play");
	};

	const checkNarrationScreen = () => {
		cy.genieClick("#narrative__continue");
		cy.genieClick("#narrative__continue");
		cy.genieClick("#narrative__continue");
	};

	const checkCharacterSelect = () => {
		cy.get("#character-select__home").should("exist");
		cy.get("#character-select__previous").should("exist");
		cy.get("#character-select__next").should("exist");
		cy.get("#character-select__mary").should("exist");
		cy.get("#character-select__kyle").should("exist");
		cy.get("#character-select__suzy").should("exist");
		cy.get("#character-select__greg").should("exist");
		cy.get("#character-select__ezinma").should("exist");
		cy.genieClick("#character-select__phil");
	};

	const checkLevelSelect = () => {
		cy.get("#level-select__home").should("exist");
		cy.get("#level-select__pause").should("exist");
		cy.get("#level-select__previous").should("exist");
		cy.get("#level-select__next").should("exist");
		cy.get("#level-select__2").should("exist");
		cy.genieClick("#level-select__1");
	};

	const checkGameplayScreen = () => {
		cy.get("#game__1").should("exist");
		cy.get("#game__2").should("exist");
		cy.get("#game__3").should("exist");
		cy.genieClick("#game__4");
	};

	const checkResultsScreen = () => {
		cy.get("#results__restart").should("exist");
		cy.get("#results__pause").should("exist");
		cy.get("#results__achievements-small").should("exist");
		cy.genieClick("#results__continue");
	};

	const checkResultsScreenReplay = () => {
		cy.get("#results__pause").should("exist");
		cy.get("#results__achievements-small").should("exist");
		cy.get("#results__continue").should("exist");
		cy.get("#results__restart");
	};
	beforeEach(() => {
		cy.viewport(1106, 800);
		cy.visit(getUrl());
		cy.get("#home__play", { timeout: 60000 }).should("exist");
		if (!Cypress.env("LOCAL_DEV")) {
			cy.get(".data-notice").click();
		}
	});

	it("Navigates through the core flow and loads the next level select after completion", () => {
		checkHomeScreen();
		checkNarrationScreen();
		checkCharacterSelect();
		checkLevelSelect();
		checkGameplayScreen();
		checkResultsScreen();
		checkLevelSelect();
	});

	it("Navigates through the core flow and replays the level from results", () => {
		checkHomeScreen();
		checkNarrationScreen();
		checkCharacterSelect();
		checkLevelSelect();
		checkGameplayScreen();
		checkResultsScreenReplay();
	});

	it("Navigates through the core flow and screenshots each page", () => {
		cy.genieClick("#home__play");
		cy.genieClick("#narrative__pause");
		cy.genieClick("#pause__how-to-play");
		cy.genieClick("#how-to-play__back");
		cy.genieClick("#pause__play");
		checkNarrationScreen();
		cy.genieClick("#character-select__phil");
		cy.genieClick("#level-select__1");
	});
});
