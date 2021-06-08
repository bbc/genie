/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export var gmi = {};

var dedupeGlobalSettings = function dedupeGlobalSettings(customSettings) {
  return customSettings.filter(function (customSettings) {
    return !(customSettings.key === "audio" || customSettings.key === "motion");
  });
};

var addExtraGlobalSettings = function addExtraGlobalSettings(customSettingsObject, settingsConfig) {
  var extraGlobalSettings = dedupeGlobalSettings(customSettingsObject.settings);
  return settingsConfig.pages[0].settings.concat(extraGlobalSettings);
};

var getDefaultGlobals = function getDefaultGlobals() {
  return {
    pages: [{
      title: "Global Settings",
      settings: [{
        key: "audio",
        type: "toggle",
        title: "Audio",
        description: "Turn off/on sound and music"
      }, {
        key: "motion",
        type: "toggle",
        title: "Motion FX",
        description: "Turn off/on motion effects"
      }]
    }]
  };
};

export var setGmi = function setGmi(customSettings, windowObj) {
  var settingsConfig = getDefaultGlobals();

  if (customSettings && customSettings.pages) {
    customSettings.pages.forEach(function (customSettingsObject) {
      if (customSettingsObject.title === "Global Settings") {
        settingsConfig.pages[0].settings = addExtraGlobalSettings(customSettingsObject, settingsConfig);
      } else {
        settingsConfig.pages = settingsConfig.pages.concat([customSettingsObject]);
      }
    });
  }

  gmi = windowObj.getGMI({
    settingsConfig: settingsConfig
  });
};