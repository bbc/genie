/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
var limit = function limit(val) {
  return val < 1 ? 1 : val;
};

export var rectUpdateFn = function rectUpdateFn(rect, updateCoords) {
  return function (size) {
    rect.x += size.x;
    rect.y += size.y;
    rect.width = limit(rect.width + size.width);
    rect.height = limit(rect.height + size.height);
    rect.geom.width = rect.width;
    rect.geom.height = rect.height;
    rect.updateDisplayOrigin();
    rect.updateData();
    rect.input.hitArea = rect.geom;
    updateCoords(rect);
  };
};