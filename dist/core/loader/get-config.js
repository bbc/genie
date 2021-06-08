/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
export var getConfig = function getConfig(screen, path) {
  var configFile = screen.cache.json.get(path).config;
  var keys = configFile.files.map(function (file) {
    return configFile.prefix + file.key;
  });
  var entries = keys.map(function (key) {
    return screen.cache.json.get(key);
  });
  return entries.reduce(function (acc, entry) {
    return fp.merge(acc, entry);
  }, {});
};