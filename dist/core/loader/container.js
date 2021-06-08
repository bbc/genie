/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../gmi/gmi.js";
export var getContainerDiv = function getContainerDiv() {
  var containerDiv = document.getElementById(gmi.gameContainerId);

  if (!containerDiv) {
    throw Error("Container element \"#".concat(gmi.gameContainerId, "\" not found"));
  } else {
    return containerDiv;
  }
};