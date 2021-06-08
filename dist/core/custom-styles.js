/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export var addCustomStyles = function addCustomStyles() {
  var customStyles = [".hide-focus-ring:focus { outline:none; }", ".gel-button { -webkit-user-select: none; }"];
  var styleElement = document.createElement("style");
  styleElement.innerHTML = customStyles.join(" ");
  document.head.appendChild(styleElement);
};