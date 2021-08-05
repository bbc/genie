/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { appendToken } from "../support/appendToken.js";

let localTesting =
	"http://localhost:9001/?debug=true&exitGameUrl=https%3A%2F%2Fwww.bbc.co.uk%2Fcbbc%2Fgames%2Fdanger-mouse-game%3Fcollection%3Dcbbc-top-games";
let localTheme2 =
	"http://localhost:9001/?debug=true&theme=theme2&exitGameUrl=https%3A%2F%2Fwww.bbc.co.uk%2Fcbbc%2Fgames%2Fdanger-mouse-game%3Fcollection%3Dcbbc-top-games";
let testTheme2 =
	"https://www.test.bbc.co.uk/games/embed/genie?versionOverride=latest&viewNonPublished=true&cageEnv=test&debug=true&theme=theme2&exitGameUrl=https%3A%2F%2Fwww.bbc.co.uk%2Fcbbc%2Fgames%2Fdanger-mouse-game%3Fcollection%3Dcbbc-top-games";
let test =
	"https://www.test.bbc.co.uk/games/embed/genie?versionOverride=latest&viewNonPublished=true&cageEnv=test&debug=true&exitGameUrl=https%3A%2F%2Fwww.bbc.co.uk%2Fcbbc%2Fgames%2Fdanger-mouse-game%3Fcollection%3Dcbbc-top-games";

const getLocalUrl = () => (Cypress.env("THEME") === "theme_1" ? localTesting : localTheme2);
const getTestUrl = () => (Cypress.env("THEME") === "theme_1" ? test : testTheme2);
export const getUrl = () => appendToken(Cypress.env("LOCAL_DEV") ? getLocalUrl() : getTestUrl());
