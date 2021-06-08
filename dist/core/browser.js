/**
 * Thin wrapper for Bowser {@link https://github.com/lancedikson/bowser}
 *
 * Exposes the browser name and any browser sniffing shortcuts used in Genie.
 *
 * @module core/browser
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import Bowser from "../../node_modules/bowser/src/bowser.js";
export var getBrowser = function getBrowser() {
  var browserInfo = Bowser.getParser(window.navigator.userAgent);
  var name = browserInfo.getBrowserName();
  var version = browserInfo.getBrowserVersion();
  var isSilk = name === "Amazon Silk"; //Ipad 2 faster in Canvas. Force bool as Bowser returns undefined if browser doesn't match

  var forceCanvas = Boolean(browserInfo.satisfies({
    safari: "<10"
  }));
  return {
    name: name,
    version: version,
    forceCanvas: forceCanvas,
    isSilk: isSilk
  };
};