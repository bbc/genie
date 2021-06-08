/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
var paths = [[function (x) {
  return x.gameButton;
}, function (x) {
  return "".concat(x.scene, ".").concat(x.key);
}], [function (x) {
  return x.isMobile;
}, function (x) {
  return "gelMobile." + x.key;
}], [function (x) {
  return !x.isMobile;
}, function (x) {
  return "gelDesktop." + x.key;
}]];
export var assetPath = fp.cond(paths);