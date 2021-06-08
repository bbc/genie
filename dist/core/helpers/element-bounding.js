/**
 * restricts positioning of an elements on a screen.
 *
 * @module components/helpers/element-bounding
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export var positionElement = function positionElement(element, position, safeArea, metrics) {
  element.setPosition(position.x, position.y);
  element.setOrigin(0.5);
  restrictBounds(element, safeArea, metrics);
};

var scaleElement = function scaleElement(element, bounds) {
  var safeHeight = bounds.bottom - bounds.top;
  var safeWidth = bounds.right - bounds.left;

  if (element.height > safeHeight && safeHeight > 0) {
    var hDiff = (element.height - safeHeight) / element.height;
    element.setScale(1 - hDiff);
  } // Check safeWidth is positive, can scale negatively when the screen is too small


  if (element.width > safeWidth && safeWidth > 0) {
    var wDiff = (element.width - safeWidth) / element.width;
    element.setScale(1 - wDiff);
  }
};

var restrictBounds = function restrictBounds(element, safeArea, metrics) {
  if (element.type === "Text") enforceTextSize(element, metrics);
  scaleElement(element, safeArea);
  var hitArea = element.getBounds();
  var elementBounds = {
    top: hitArea.y,
    bottom: hitArea.y + hitArea.height,
    left: hitArea.x,
    right: hitArea.x + hitArea.width
  };

  if (elementBounds.top < safeArea.top) {
    element.setPosition(element.x, element.y - (elementBounds.top - safeArea.top));
  }

  if (elementBounds.bottom > safeArea.bottom) {
    element.setPosition(element.x, element.y - (elementBounds.bottom - safeArea.bottom));
  }

  if (elementBounds.left < safeArea.left) {
    element.setPosition(element.x - (elementBounds.left - safeArea.left), element.y);
  }

  if (elementBounds.right > safeArea.right) {
    element.setPosition(element.x - (elementBounds.right - safeArea.right), element.y);
  }
};

export var enforceTextSize = function enforceTextSize(element, _ref) {
  var scale = _ref.scale;
  var fontSize = parseInt(element.defaultStyle.fontSize);
  var minimumSize = 13;
  var currentSize = fontSize * scale;
  element.setFontSize("".concat(fontSize, "px"));

  if (currentSize < minimumSize) {
    var newScale = minimumSize / currentSize;
    element.setFontSize("".concat(fontSize * newScale, "px"));
  }
};