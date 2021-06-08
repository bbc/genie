/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Launcher } from "./launcher.js";
import { examples } from "./examples.js";
import { getConfig } from "../loader/get-config.js";
import fp from "../../../lib/lodash/fp/fp.js";
var launcherScreen = {
  debug: {
    scene: Launcher,
    routes: {
      home: "home"
    }
  }
};

var getDebugScreenWithRoutes = function getDebugScreenWithRoutes() {
  Object.keys(examples).map(function (screenKey) {
    return launcherScreen.debug.routes[screenKey] = screenKey;
  });
  return launcherScreen;
};

var addScene = function addScene(scene) {
  return function (key) {
    return scene.scene.add(key, examples[key].scene);
  };
};

var addScreens = function addScreens(scene) {
  Object.keys(examples).map(addScene(scene));
  var debugTheme = getConfig(scene, "example-files").theme;
  var config = scene.context.config;
  config.navigation = scene.context.navigation;
  Object.assign(config.theme, debugTheme);
  Object.assign(config.navigation, examples); //name method for this

  scene.setConfig(config);
};

export var addExampleScreens = fp.once(addScreens);
export var getLauncherScreen = function getLauncherScreen(isDebug) {
  return isDebug ? getDebugScreenWithRoutes() : {};
};