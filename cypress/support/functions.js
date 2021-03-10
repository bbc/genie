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

export const formatStatConfig = (
    stat,
    { actionName, actionType, creationId, format, advertiserId, screenName } = {},
) => {
    let bucketString;

    if (actionType && actionName) {
        stat.creationId = `${actionName}~${actionType}`;
    }

    if (creationId) {
        stat.creationId = creationId;
    }

    if (format) {
        stat.format = format;
    }

    if (advertiserId) {
        stat.advertiserId = advertiserId;
    }

    if (screenName) {
        stat.screenName = screenName;
    }

    const generalPlacement = (generalPlacement, screenName) => {
        if (screenName === "") {
            return `${generalPlacement}.page`;
        } else {
            return `${generalPlacement}.${screenName}.page`;
        }
    };

    const countername = (countername, screenName) => {
        if (screenName === "") {
            return `${countername}.page`;
        } else {
            return `${countername}.${screenName}.page`;
        }
    };

    if (stat.bucket === "testGames") {
        bucketString = `s=${599452}`;
    } else if (stat.bucket === "prodGames") {
        bucketString = `s=${598261}`;
    }

    const counternameString = countername(stat.counterName, stat.screenName);
    const statString = `[${stat.campaignId}]-[${stat.creationId}]-[${stat.variant}]-[${
        stat.format
    }]-[${generalPlacement(stat.generalPlacement, stat.screenName)}]-[${stat.detailedPlacement}]-[${
        stat.advertiserId
    }]-[${stat.url}]`;
    const newStatData = {
        bucket: bucketString,
        stat: statString,
        counterName: `p=${counternameString}`,
        event: `echo_event=${stat.event}`,
    };
    cy.log(stat.screenName);
    return newStatData;
};
