/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../gmi/gmi.js";

export const getContainerDiv = () => {
	const containerDiv = document.getElementById(gmi.gameContainerId);
	if (!containerDiv) {
		throw Error(`Container element "#${gmi.gameContainerId}" not found`);
	} else {
		return containerDiv;
	}
};
