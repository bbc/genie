/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { appendToken } from "../support/appendToken.js";

let localTesting = "http://localhost:9000/?debug=true";
let localTheme2 = "http://localhost:9000/?debug=true&theme=theme2";
let testTheme2 =
    "https://www.test.bbc.co.uk/games/embed/genie?versionOverride=latest&viewNonPublished=true&cageEnv=test&debug=true&theme=theme2";
let test =
    "https://www.test.bbc.co.uk/games/embed/genie?versionOverride=latest&viewNonPublished=true&cageEnv=test&debug=true";

export const getUrl = () => {
    if (Cypress.env("LOCAL_DEV") == "true") {
        if (Cypress.env("THEME_2") == "true") {
            cy.log("match");
            return appendToken(localTheme2);
        } else {
            cy.log("Not theme 2");
            return appendToken(localTesting);
        }
    } else {
        if (Cypress.env("THEME_2") == "true") {
            cy.log("match");
            return appendToken(testTheme2);
        } else {
            cy.log("Not theme 2");
            return appendToken(test);
        }
    }
};
