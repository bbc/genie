/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../../core/gmi/gmi.js";

const getScoreMetaData = result => {
    if (Object.keys(result).length === 0) {
        return undefined;
    }
    let resultString = resultsToString(result);
    return { metadata: `SCO=${resultString}` };
};

const resultsToString = obj => {
    let resultString = "";
    let first = true;
    for (const x in obj) {
        if (first === true) {
            resultString += `[${x}-${obj[x]}]`;
            first = false;
        } else {
            resultString += `::[${x}-${obj[x]}]`;
        }
    }
    return resultString;
};

export const fireGameCompleteStat = result => {
    gmi.sendStatsEvent("score", "display", getScoreMetaData(result));
};
