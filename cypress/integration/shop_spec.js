/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
describe("The Genie Shop component", () => {
    beforeEach(() => {
        cy.visit(
            "https://www.test.bbc.co.uk/games/embed/genie?versionOverride=latest&viewNonPublished=true&cageEnv=test&debug=true",
        );
        cy.get("#home__play", { timeout: 40000 }).should("exist");
        cy.get(".data-notice").click();
        cy.genieClick("#home__debug");
        cy.genieClick("#debug__debug-shop-demo");
        cy.genieClick("#debug-shop-demo__Shop");
    });

    it("Successfully purchase and equip an item", () => {
        cy.genieClick("#debug-shop-demo-shop__shop_menu_button");
        cy.genieClick("#debug-shop-demo-shop__scroll_button_redHat_shop");
        cy.genieClick("#debug-shop-demo-shop__tx_confirm_button");
        cy.genieClick("#debug-shop-demo-shop__back");
        cy.genieClick("#debug-shop-demo-shop__manage_menu_button");
        cy.genieClick("#debug-shop-demo-shop__scroll_button_redHat_manage");
        cy.genieClick("#debug-shop-demo-shop__tx_confirm_button");
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