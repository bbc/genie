/**
 * Displays console errors on screen.
 *
 * @module components/loader/hookErrors
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export var hookErrors = function hookErrors(gameDivId) {
  var containerDiv = document.getElementById(gameDivId) || document.body;
  var messageElement;
  window.addEventListener("error", function (event) {
    if (!messageElement) {
      messageElement = containerDiv.appendChild(document.createElement("pre"));
      var padding = "2em";
      var style = messageElement.style;
      style.position = "absolute";
      style.top = style.left = "0";
      style.backgroundColor = "black";
      style.color = "white";
      style.padding = padding;
      style.width = style.height = "calc(100% - 2 * ".concat(padding, ")");
    }

    messageElement.innerText = "Something isn't working:\n\n".concat(event.error.message || event.error, "\n\n").concat(event.error.stack || "");
  });
};