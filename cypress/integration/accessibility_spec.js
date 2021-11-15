/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getUrl } from "../support/functions";
import { appendToken } from "../support/appendToken";

describe(`Tests the accessibility of Genie screens for ${Cypress.env("THEME")}`, () => {
	beforeEach(() => {
		cy.visit(appendToken(`${Cypress.env("url")}${getUrl()}`));
		cy.get("#home__play", { timeout: 60000 }).should("exist");
	});

	it("tests the tab order & aria labels of the How To Play screen", () => {
		cy.genieClick("#home__how-to-play");
		cy.get("body").tab();
		cy.ariaLabel("Back");
		cy.tabFocused("how-to-play__back");
		cy.ariaLabel("Toggle Sound");
		cy.tabFocused("how-to-play__audio");
		cy.ariaLabel("Game Settings");
		cy.tabFocused("how-to-play__settings");
		cy.ariaLabel("Next Item");
		cy.focused().should("have.attr", "id", "how-to-play__next");
		cy.focused().type("{enter}", { force: true });
		cy.tabFocused("how-to-play__next");
		cy.tabFocused("how-to-play__back");
		cy.tabFocused("how-to-play__audio");
		cy.tabFocused("how-to-play__settings");
		cy.ariaLabel("Previous Item");
		cy.tabFocused("how-to-play__previous");
	});

	it("tests the tab order & aria lables of the Narrative screen", () => {
		cy.genieClick("#home__debug");
		cy.genieClick("#debug__debug-narrative");
		cy.get("body").tab();
		cy.ariaLabel("Pause Game");
		cy.tabFocused("debug-narrative__pause");
		cy.ariaLabel("Continue");
		cy.tabFocused("debug-narrative__continue");
		cy.ariaLabel("Skip");
		cy.focused().should("have.attr", "id", "debug-narrative__skip");
		cy.focused().type("{enter}", { force: true });
	});

	it("Navigates through the Narrative screen with Tab & Enter", () => {
		cy.genieClick("#home__debug");
		cy.genieClick("#debug__debug-narrative");
		cy.get("body").tab();
		cy.tabFocused("debug-narrative__pause");
		cy.focused().should("have.attr", "id", "debug-narrative__continue");
		cy.get("#debug-narrative__continue").type("{enter}", { force: true });
		cy.tabFocused("debug-narrative__continue");
		cy.focused().should("have.attr", "id", "debug-narrative__skip");
		cy.get("#debug-narrative__skip").type("{enter}", { force: true });
		cy.get("#debug__debug-narrative", { timeout: 60000 });
	});

	it("tests the tab order & aria labels of the Pause screen", () => {
		cy.genieClick("#home__play");
		cy.genieClick("#narrative__pause");
		cy.get("body").tab();
		cy.ariaLabel("Home");
		cy.tabFocused("pause__home");
		cy.ariaLabel("Toggle Sound");
		cy.tabFocused("pause__audio");
		cy.ariaLabel("Game Settings");
		cy.tabFocused("pause__settings");
		cy.ariaLabel("Play Game");
		cy.tabFocused("pause__play");
		cy.ariaLabel("Level Select");
		cy.tabFocused("pause__levelselect");
		cy.ariaLabel("Your Achievements");
		cy.tabFocused("pause__achievements");
		cy.ariaLabel("Game Instructions");
		cy.tabFocused("pause__how-to-play");
		cy.tabFocused("pause__home");
	});

	it("Navigates through the Pause screen with Tab & Enter", () => {
		cy.genieClick("#home__play");
		cy.genieClick("#narrative__pause");
		cy.get("body").tab();
		cy.tabFocused("pause__home");
		cy.tabFocused("pause__audio");
		cy.tabFocused("pause__settings");
		cy.focused().should("have.attr", "id", "pause__play");
		cy.focused().type("{enter}", { force: true });
		cy.get("#narrative__pause").type("enter", { force: true });
		cy.get("body").tab();
		cy.tabFocused("pause__home");
		cy.tabFocused("pause__audio");
		cy.tabFocused("pause__settings");
		cy.tabFocused("pause__play");
		cy.focused().should("have.attr", "id", "pause__levelselect");
		cy.get("#pause__levelselect").type("{enter}", { force: true });
		cy.get("#character-select__home");
	});

	it("tests the tab order & aria labels of the Results screen", () => {
		cy.genieClick("#home__debug");
		cy.genieClick("#debug__debug-results-bitmaptext");
		cy.get("body").tab();
		cy.ariaLabel("Your Achievements");
		cy.tabFocused("debug-results-bitmaptext__achievements-small");
		cy.ariaLabel("Pause Game");
		cy.tabFocused("debug-results-bitmaptext__pause");
		cy.ariaLabel("Restart Game");
		cy.tabFocused("debug-results-bitmaptext__restart");
		cy.ariaLabel("Continue Game");
		cy.tabFocused("debug-results-bitmaptext__continue");
		cy.tabFocused("debug-results-bitmaptext__achievements-small");
	});

	it("Navigates through the Results screen with Tab & Enter", () => {
		cy.genieClick("#home__debug");
		cy.genieClick("#debug__debug-results-bitmaptext");
		cy.get("body").tab();
		cy.focused()
			.should("have.attr", "id", "debug-results-bitmaptext__achievements-small")
			.type("{enter}", { force: true });

		cy.focused().should("have.attr", "data-testid", "close-achievements").type("{enter}", { force: true });
		cy.get("body").tab();
		cy.tabFocused("debug-results-bitmaptext__achievements-small");
		cy.tabFocused("debug-results-bitmaptext__pause");
		cy.focused().should("have.attr", "id", "debug-results-bitmaptext__restart").type("{enter}", { force: true });
		cy.genieClick("#debug__debug-results-bitmaptext");
	});

	it("tests the tab order & aria labels of the Shop screen", () => {
		cy.genieClick("#home__debug");
		cy.genieClick("#debug__debug-shop-equippables-menu");
		cy.get("body").tab();
		cy.ariaLabel("Back");
		cy.tabFocused("debug-shop-equippables-menu__back");
		cy.ariaLabel("Pause Game");
		cy.tabFocused("debug-shop-equippables-menu__pause");
		cy.ariaLabel("Shop");
		cy.tabFocused("debug-shop-equippables-menu__shop_menu_button");
		cy.ariaLabel("Manage");
		cy.tabFocused("debug-shop-equippables-menu__manage_menu_button");
		cy.tabFocused("debug-shop-equippables-menu__back");
	});

	it("Navigates through the Shop equipables store flow with Tab & Enter", () => {
		cy.genieClick("#home__debug");
		cy.genieClick("#debug__debug-shop-equippables-menu");
		cy.get("body").tab();
		cy.tabFocused("debug-shop-equippables-menu__back");
		cy.tabFocused("debug-shop-equippables-menu__pause");
		cy.focused()
			.should("have.attr", "id", "debug-shop-equippables-menu__shop_menu_button")
			.type("{enter}", { force: true });

		cy.get("body").tab();
		cy.tabFocused("debug-shop-equippables-list__back");
		cy.tabFocused("debug-shop-equippables-list__pause");
		cy.tabFocused("debug-shop-equippables-list__scroll_button_shield_shop");
		cy.tabFocused("debug-shop-equippables-list__scroll_button_ironHat_shop");
		cy.tabFocused("debug-shop-equippables-list__scroll_button_greenHat_shop");
		cy.tabFocused("debug-shop-equippables-list__scroll_button_redHat_shop");
		cy.tabFocused("debug-shop-equippables-list__scroll_button_goldHat_shop");
		cy.tabFocused("debug-shop-equippables-list__back");
		cy.tabFocused("debug-shop-equippables-list__pause");
		cy.tabFocused("debug-shop-equippables-list__scroll_button_shield_shop");
		cy.focused()
			.should("have.attr", "id", "debug-shop-equippables-list__scroll_button_ironHat_shop")
			.type("{enter}", { force: true });
		cy.get("body").tab();
		cy.tabFocused("debug-shop-equippables-confirm__back");
		cy.tabFocused("debug-shop-equippables-confirm__pause");
		cy.focused()
			.should("have.attr", "id", "debug-shop-equippables-confirm__tx_buy_button")
			.type("{enter}", { force: true });
		cy.get("body").tab();
		cy.tabFocused("debug-shop-equippables-list__back");
	});

	it("Navigates through the Shop equipables management flow with Tab & Enter", () => {
		cy.genieClick("#home__debug");
		cy.genieClick("#debug__debug-shop-equippables-menu");
		cy.get("body").tab();
		cy.tabFocused("debug-shop-equippables-menu__back");
		cy.tabFocused("debug-shop-equippables-menu__pause");
		cy.tabFocused("debug-shop-equippables-menu__shop_menu_button");
		cy.ariaLabel("Manage").type("{enter}", { force: true });
		cy.get("body").tab();
		cy.tabFocused("debug-shop-equippables-list__back");
		cy.tabFocused("debug-shop-equippables-list__pause");
		cy.ariaLabel("Mystery Box - What lies inside?").type("{enter}", { force: true });
		cy.get("body").tab();
		cy.tabFocused("debug-shop-equippables-confirm__back");
		cy.tabFocused("debug-shop-equippables-confirm__pause");
		cy.ariaLabel("Use").type("{enter}", { force: true });
		cy.get("body").tab();
		cy.tabFocused("debug-shop-equippables-list__back");
	});

	it("Tests closing the settings modal through tab & enter", () => {
		cy.genieClick("#home__play");
		cy.genieClick("#narrative__pause");
		cy.genieClick("#pause__settings");
		cy.get("body").tab();
		cy.focused().tab();
		cy.focused().should("have.attr", "data-testid", "close-settings").type("{enter}", { force: true });
		cy.get("[data-testid=settings-modal]").should("not.exist");
	});

	it("Tests closing the achievements modal by using Tab and Enter keys", () => {
		cy.genieClick("#home__achievements");
		cy.focused().tab();
		cy.focused().should("have.attr", "data-testid", "close-achievements").type("{enter}", { force: true });
		cy.get("[data-testid=achievements-modal]").should("not.exist");
	});

	it("Tests the full end to end flow through genie using tab & enter", () => {
		const tabLoop = (element, tabs) => {
			cy.get("body").tab();
			for (let index = 0; index < tabs; index++) {
				cy.focused().tab();
			}
			cy.focused().should("have.attr", "id", element).type("{enter}", { force: true });
		};
		tabLoop("home__play", 3);
		tabLoop("narrative__skip", 2);
		tabLoop("character-select__mary", 3);
		tabLoop("level-select__1", 3);
		tabLoop("game__4", 4);
		tabLoop("results__continue", 3);
		cy.get("#level-select__1").should("exist");
	

	});
	it("Tests the navigation on debug screen for single select item with Tab & Enter", () => {
        cy.genieClick("#home__debug");
        cy.genieClick("#debug__debug-select-1");
        cy.tab("#debug-select-1__home");
        cy.tab("#debug-select-1__pause");
        cy.tab("#debug-select-1__mary");
        cy.ariaLabel("Mary completed").type("{enter}", { force: true });
        cy.get("#debug-select-1__mary").should("not.exist");
        
    });
    it("Tests the navigation on debug screen for Select Grid with Tab & Enter", () => {
        cy.genieClick("#home__debug");
        cy.genieClick("#debug__debug-select-grid");
        cy.genieClick("#debug-select-grid__mary");
        cy.tab("#debug-select-grid__home");
        cy.tab("#debug-select-grid__pause");
        cy.tab("#debug-select-grid__previous");
        cy.tab("#debug-select-grid__mary");
        cy.focused().should("have.attr", "tabindex", "0").type("{enter}", { force: true });
        cy.get("#debug-select-grid__mary").should("not.exist"); 
    });
    it("Tests the navigation on debug screen for Result-bitmaptext with Tab & Enter", () => {
        cy.genieClick("#home__debug");
        cy.genieClick("#debug__debug-results-bitmaptext");
        cy.genieClick("#debug-results-bitmaptext__restart");
        cy.tab("#debug-results-bitmaptext__achievements-small");
        cy.tab("#debug-results-bitmaptext__pause");
        cy.tab("#debug-results-bitmaptext__restart");
        cy.focused().should("have.attr", "tabindex", "0").type("{enter}", { force: true });
        //cy.ariaLabel("Restart Game").type("{enter}", { force: true });
        cy.get("#debug-results-bitmaptext__restart").should("not.exist");   
    });
    
    it("Tests the navigation on debug screen for Background Animations with Tab & Enter", () => {
        cy.genieClick("#home__debug");
        cy.genieClick("#debug__debug-background-animations");
        cy.genieClick("#debug-background-animations__debug");
        cy.tab("#debug-background-animations__exit");
        cy.tab("#debug-background-animations__audio");
        cy.tab("#debug-background-animations__settings");
        cy.tab("#debug-background-animations__play");
        cy.focused().should("have.attr", "tabindex", "0").type("{enter}", { force: true });
        //cy.ariaLabel("Play Game").type("{enter}", { force: true });
        cy.get("#debug-background-animations__debug").should("not.exist");
        
    });
    it("Tests the navigation on debug screen for Debug DOM Text with Tab & Enter", () => {
        cy.genieClick("#home__debug");
        cy.genieClick("#debug__debug-dom-text");
        cy.genieClick("#debug-dom-text__play");
        cy.tab("#debug-dom-text__exit");
        cy.tab("#debug-dom-text__pause");
        cy.tab("#debug-dom-text__play");
        cy.focused().should("have.attr", "tabindex", "0").type("{enter}", { force: true });
        //cy.ariaLabel("Play Game").type("{enter}", { force: true });
        cy.get("#debug-dom-text__play").should("not.exist");
        
    });
});
