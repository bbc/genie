/**
 * Displays console errors on screen.
 *
 * @module components/loader/hookErrors
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export const hookErrors = gameDivId => {
	const containerDiv = document.getElementById(gameDivId) || document.body;
	let messageElement;

	window.addEventListener("error", event => {
		if (!messageElement) {
			messageElement = containerDiv.appendChild(document.createElement("pre"));
			const padding = "2em";
			const style = messageElement.style;
			style.position = "absolute";
			style.top = style.left = "0";
			style.backgroundColor = "black";
			style.color = "white";
			style.padding = padding;
			style.width = style.height = `calc(100% - 2 * ${padding})`;
		}
		messageElement.innerText = `Something isn't working:\n\n${event.error.message || event.error}\n\n${
			event.error.stack || ""
		}`;
	});
};
