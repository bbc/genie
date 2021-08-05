/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export const addCustomStyles = () => {
	const customStyles = [".hide-focus-ring:focus { outline:none; }", ".gel-button { -webkit-user-select: none; }"];
	const styleElement = document.createElement("style");
	styleElement.innerHTML = customStyles.join(" ");
	document.head.appendChild(styleElement);
};
