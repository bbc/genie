/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { appendToken } from "../support/appendToken.js";

let localTesting = "http://localhost:9001/?debug=true";
let localTheme2 = "http://localhost:9001/?debug=true&theme=theme2";
let testTheme2 =
    "https://www.test.bbc.co.uk/games/embed/genie?versionOverride=latest&viewNonPublished=true&cageEnv=test&debug=true&theme=theme2";
let test =
    "https://www.test.bbc.co.uk/games/embed/genie?versionOverride=latest&viewNonPublished=true&cageEnv=test&debug=true";
export const getUrl = () => {
    if (Cypress.env("LOCAL_DEV") == "true") {
        if (Cypress.env("THEME") == "theme_2") {
            cy.log("theme 2 dev");
            return appendToken(localTheme2);
        } else {
            cy.log("theme 1 dev");
            return appendToken(localTesting);
        }
    } else {
        if (Cypress.env("THEME") == "theme_2") {
            return appendToken(testTheme2);
        } else {
            return appendToken(test);
        }
    }
};
