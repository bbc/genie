/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../../core/gmi/gmi.js";

var getScoreMetaData = function getScoreMetaData(result) {
  if (Object.keys(result).length === 0) {
    return undefined;
  }

  var resultString = resultsToString(result);
  return {
    metadata: "SCO=".concat(resultString)
  };
};

var resultsToString = function resultsToString(obj) {
  var resultString = "";
  var first = true;

  for (var x in obj) {
    if (first === true) {
      resultString += "[".concat(x, "-").concat(obj[x], "]");
      first = false;
    } else {
      resultString += "::[".concat(x, "-").concat(obj[x], "]");
    }
  }

  return resultString;
};

export var fireGameCompleteStat = function fireGameCompleteStat(result) {
  gmi.sendStatsEvent("score", "display", getScoreMetaData(result));
};