/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { gmi } from "../../core/gmi/gmi.js";

const getScoreMetaData = transientData => {
	const results = fp.omit(["levelId", "gameComplete"], transientData);
	if (Object.keys(results).length === 0) {
		return undefined;
	}
	return { metadata: `SCO=${resultsToString(results)}` };
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

export const fireGameCompleteStat = transientData => {
	gmi.sendStatsEvent("score", "display", { source: transientData.levelId, ...getScoreMetaData(transientData) });
};
