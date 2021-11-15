/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

const basicUrl =
	"?game=genie&v=latest&debug=true&exitGameUrl=https%3A%2F%2Fwww.bbc.co.uk%2Fcbbc%2Fgames%2Fdanger-mouse-game%3Fcollection%3Dcbbc-top-games";

export const getUrl = () => (Cypress.env("theme") === "theme_1" ? `${basicUrl}&theme_1` : `${basicUrl}&theme_2`);
