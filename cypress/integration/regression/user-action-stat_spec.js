/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { formatStatConfig } from "../../support/functions";
import { getUrl } from "../../support/functions";
import { userActions } from "../../support/statConfig";

describe("User Action stats for Genie", () => {
    beforeEach(() => {
        cy.intercept("gameloaded").as("gameStat");
        cy.visit(getUrl());
        cy.get("#home__play", { timeout: 60000 }).should("exist");
        if (!Cypress.env("DEV_LOCAL") == "true") {
            cy.get(".data-notice").click();
        }
    });

    it("Fires a stat when the game is loaded", () => {
        cy.wait("@gameStat").then(interception => {
            cy.log(interception).its("response.url").should("include", formatStatConfig(userActions.gameloaded).stat);
        });
    });

    it("Fires a click event when the play button is clicked", () => {
        cy.intercept(userActions.clickPlay.creationId).as("playClick");
        cy.genieClick("#home__play");
        cy.wait("@playClick").then(interception => {
            cy.log(interception).its("response.url").should("include", formatStatConfig(userActions.clickPlay).stat);
        });
    });

    it("Fires a click event when the how to play button is clicked", () => {
        cy.intercept(userActions.clickHowtoplay.creationId).as("htpClick");
        cy.genieClick("#home__how-to-play");
        cy.wait("@htpClick").then(interception => {
            cy.log(interception)
                .its("response.url")
                .should("include", formatStatConfig(userActions.clickHowtoplay).stat);
        });
    });

    it("Fires a click event when the achievements page is opened and closed", () => {
        cy.intercept(userActions.achievementsOpen.creationId).as("achievementsOpen");
        cy.intercept(userActions.achievementsClose.creationId).as("achievementsClose");
        cy.genieClick("#home__achievements");
        cy.wait("@achievementsOpen").then(interception => {
            cy.log(interception)
                .its("response.url")
                .should("include", formatStatConfig(userActions.achievementsOpen).stat);
        });
        cy.genieClick(".cage-overlay__close-button");
        cy.wait("@achievementsClose").then(interception => {
            cy.log(interception)
                .its("response.url")
                .should("include", formatStatConfig(userActions.achievementsClose).stat);
        });
    });

    it("Fires a user action event when a character is selected", () => {
        cy.intercept("character~select").as("characterSelect");
        cy.intercept("level~select").as("levelSelect");
        cy.genieClick("#home__play");
        cy.genieClick("#narrative__skip");
        cy.genieClick("#character-select__mary");
        cy.wait("@characterSelect").then(interception => {
            cy.log(interception)
                .its("response.url")
                .should(
                    "include",
                    formatStatConfig(userActions.selectItem, {
                        creationId: "character~select",
                        format: "ELE=Mary",
                        screenName: "character_select",
                    }).stat,
                );
        });
        cy.genieClick("#level-select__1");
        cy.wait("@levelSelect").then(interception => {
            cy.log(interception)
                .its("response.url")
                .should(
                    "include",
                    formatStatConfig(userActions.selectItem, {
                        creationId: "level~select",
                        format: "ELE=Test%20Level%201",
                        screenName: "level_select",
                    }).stat,
                );
        });
    });

    it("Fires a user action event when the next level is selected", () => {
        cy.intercept(userActions.levelContinue.creationId).as("levelContinue");
        cy.genieClick("#home__play");
        cy.genieClick("#narrative__skip");
        cy.genieClick("#character-select__mary");
        cy.genieClick("#level-select__1");
        cy.genieClick("#game__4");
        cy.genieClick("#results__continue");
        cy.wait("@levelContinue").then(interception => {
            cy.log(interception)
                .its("response.url")
                .should(
                    "include",
                    formatStatConfig(userActions.levelContinue, { advertiserId: "Test%20Level%201" }).stat,
                );
        });
    });

    it("Fires a user action event when the level is replayed", () => {
        cy.intercept(userActions.levelPlayagain.creationId).as("levelPlayagain");
        cy.genieClick("#home__play");
        cy.genieClick("#narrative__skip");
        cy.genieClick("#character-select__mary");
        cy.genieClick("#level-select__1");
        cy.genieClick("#game__4");
        cy.genieClick("#results__restart");
        cy.wait("@levelPlayagain").then(interception => {
            cy.log(interception)
                .its("response.url")
                .should(
                    "include",
                    formatStatConfig(userActions.levelPlayagain, { advertiserId: "Test%20Level%201" }).stat,
                );
        });
    });

    it("Fires a user action event when the continue button is selected on the narrative screen", () => {
        cy.intercept(userActions.narrativeContinue.creationId).as("narrativeContinue");
        cy.genieClick("#home__play");
        cy.genieClick("#narrative__continue");
        cy.wait("@narrativeContinue").then(interception => {
            cy.log(interception)
                .its("response.url")
                .should("include", formatStatConfig(userActions.narrativeContinue, { format: "PAG=0" }).stat);
        });
    });

    it("Fires a user action event when the skip button is selected on the narrative screen", () => {
        cy.intercept(userActions.narrativeSkip.creationId).as("narrativeSkip");
        cy.genieClick("#home__play");
        cy.genieClick("#narrative__skip");
        cy.wait("@narrativeSkip").then(interception => {
            cy.log(interception)
                .its("response.url")
                .should("include", formatStatConfig(userActions.narrativeSkip, { format: "PAG=0" }).stat);
        });
    });

    it("Fires a user action event when the shop store is opened.", () => {
        cy.intercept(userActions.shopBuy.creationId).as("shopBuy");
        cy.genieClick("#home__debug");
        cy.genieClick("#debug__debug-shop-equippables-menu");
        cy.genieClick("#debug-shop-equippables-menu__shop_menu_button");
        cy.wait("@shopBuy").then(interception => {
            cy.log(interception)
                .its("response.url")
                .should(
                    "include",
                    formatStatConfig(userActions.shopBuy, { screenName: "debug_shop_equippables_list" }).stat,
                );
        });
    });

    it("Fires a user action event when the shop manage menu is opened.", () => {
        cy.intercept(userActions.shopManage.creationId).as("shopManage");
        cy.genieClick("#home__debug");
        cy.genieClick("#debug__debug-shop-equippables-menu");
        cy.genieClick("#debug-shop-equippables-menu__manage_menu_button");
        cy.wait("@shopManage").then(interception => {
            cy.log(interception)
                .its("response.url")
                .should(
                    "include",
                    formatStatConfig(userActions.shopManage, { screenName: "debug_shop_equippables_list" }).stat,
                );
        });
    });

    it("Fires a user action event when an item is purchased in the shop.", () => {
        cy.intercept(userActions.shopPurchase.creationId).as("buyItem");
        cy.genieClick("#home__debug");
        cy.genieClick("#debug__debug-shop-equippables-menu");
        cy.genieClick("#debug-shop-equippables-menu__shop_menu_button");
        cy.genieClick("#debug-shop-equippables-list__scroll_button_ironHat_shop");
        cy.genieClick("#debug-shop-equippables-confirm__tx_buy_button");
        cy.wait("@buyItem").then(interception => {
            cy.log(interception)
                .its("response.url")
                .should(
                    "include",
                    formatStatConfig(userActions.shopPurchase, {
                        screenName: "debug_shop_equippables_confirm",
                        format: "KEY=ironHat-STATE=purchased-QTY=1",
                    }).stat,
                );
        });
    });

    it("Fires a user action event when an item is equipped.", () => {
        cy.intercept(userActions.shopEquip.creationId).as("equipItem");
        cy.genieClick("#home__debug");
        cy.genieClick("#debug__debug-shop-equippables-menu");
        cy.genieClick("#debug-shop-equippables-menu__shop_menu_button");
        cy.genieClick("#debug-shop-equippables-list__scroll_button_ironHat_shop");
        cy.genieClick("#debug-shop-equippables-confirm__tx_buy_button");
        cy.genieClick("#debug-shop-equippables-list__back");
        cy.genieClick("#debug-shop-equippables-menu__manage_menu_button");
        cy.genieClick("#debug-shop-equippables-list__scroll_button_ironHat_manage");
        cy.genieClick("#debug-shop-equippables-confirm__tx_equip_button");
        cy.wait("@equipItem").then(interception => {
            cy.log(interception)
                .its("response.url")
                .should(
                    "include",
                    formatStatConfig(userActions.shopEquip, {
                        screenName: "debug_shop_equippables_confirm",
                        format: "KEY=ironHat~STATE=equipped~QTY=1",
                    }).stat,
                );
        });
    });

    it("Fires a user action event when an item is used.", () => {
        cy.intercept(userActions.shopUse.creationId).as("useItem");
        cy.genieClick("#home__debug");
        cy.genieClick("#debug__debug-shop-equippables-menu");
        cy.genieClick("#debug-shop-equippables-menu__manage_menu_button");
        cy.genieClick("#debug-shop-equippables-list__scroll_button_box_manage");
        cy.genieClick("#debug-shop-equippables-confirm__tx_use_button");
        cy.wait("@useItem").then(interception => {
            cy.log(interception)
                .its("response.url")
                .should(
                    "include",
                    formatStatConfig(userActions.useItem, {
                        screenName: "debug_shop_equippables_confirm",
                        format: "KEY=box~STATE=used~QTY=1",
                    }).stat,
                );
        });
    });
});
