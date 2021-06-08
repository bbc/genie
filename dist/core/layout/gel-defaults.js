function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { settings, settingsChannel } from "../../core/settings.js"; // import * as GameSound from "../../core/game-sound.js";

import { gmi } from "../../core/gmi/gmi.js";
import { eventBus } from "../event-bus.js";
import fp from "../../../lib/lodash/fp/fp.js";

var pushLevelId = function pushLevelId(screen, params) {
  var levelId = fp.get("transientData.level-select.choice.title", screen.context);
  return levelId ? [].concat(_toConsumableArray(params), [{
    source: levelId
  }]) : params;
};

var getScreenBelow = function getScreenBelow(screen) {
  return screen.context.parentScreens.slice(-1)[0];
};

export var buttonsChannel = function buttonsChannel(screen) {
  return screen ? "gel-buttons-".concat(screen.scene.key) : "gel-buttons";
};
export var config = function config(screen) {
  return {
    exit: {
      group: "topLeft",
      title: "Exit",
      key: "exit",
      ariaLabel: "Exit Game",
      order: 0,
      id: "exit",
      channel: buttonsChannel(screen),
      action: function action() {
        gmi.exit();
        gmi.sendStatsEvent("exit", "click");
      }
    },
    home: {
      group: "topLeft",
      title: "Home",
      key: "home",
      ariaLabel: "Home",
      order: 1,
      id: "home",
      channel: buttonsChannel(screen),
      action: function action(_ref) {
        var screen = _ref.screen;
        gmi.sendStatsEvent("home", "click");
        screen.navigation.home();
      }
    },
    back: {
      group: "topLeft",
      title: "Back",
      key: "back",
      ariaLabel: "Back",
      order: 2,
      id: "back",
      channel: buttonsChannel,
      action: function action(_ref2) {
        var screen = _ref2.screen;
        gmi.sendStatsEvent("back", "click");
        screen.navigation.back();
      }
    },
    overlayBack: {
      group: "topLeft",
      title: "Back",
      key: "back",
      ariaLabel: "Back",
      order: 2,
      id: "back",
      channel: buttonsChannel(screen),
      action: function action(_ref3) {
        var screen = _ref3.screen;
        getScreenBelow(screen).scene.resume();
        gmi.sendStatsEvent("back", "click");
        screen.removeOverlay();
      }
    },
    audio: {
      group: "topRight",
      title: "Sound Off",
      key: "audio-on",
      ariaLabel: "Toggle Sound",
      order: 3,
      id: "audio",
      channel: buttonsChannel(screen),
      action: function action() {
        var audioEnabled = gmi.getAllSettings().audio;
        gmi.setAudio(!audioEnabled);
        eventBus.publish({
          channel: settingsChannel,
          name: "audio"
        });
        gmi.sendStatsEvent("audio", gmi.getAllSettings().audio ? "on" : "off");
      }
    },
    settings: {
      group: "topRight",
      title: "Settings",
      key: "settings",
      ariaLabel: "Game Settings",
      order: 5,
      id: "settings",
      channel: buttonsChannel(screen),
      action: function action(_ref4) {
        var game = _ref4.game;
        settings.show(game);
      }
    },
    pause: {
      group: "topRight",
      title: "Pause",
      key: "pause",
      ariaLabel: "Pause Game",
      order: 6,
      id: "pause",
      channel: buttonsChannel(screen),
      action: function action(_ref5) {
        var screen = _ref5.screen;
        screen.scene.pause();
        gmi.sendStatsEvent("pause", "click");
        screen.addOverlay("pause");
      }
    },
    previous: {
      group: "middleLeftSafe",
      title: "Previous",
      key: "previous",
      ariaLabel: "Previous Item",
      order: 7,
      id: "previous",
      channel: buttonsChannel(screen)
    },
    replay: {
      group: "middleCenter",
      title: "Replay",
      key: "replay",
      ariaLabel: "Replay Game",
      order: 8,
      id: "replay",
      action: function action(_ref6) {
        var screen = _ref6.screen;
        var params = pushLevelId(screen, ["level", "playagain"]);
        gmi.sendStatsEvent.apply(gmi, _toConsumableArray(params));
      }
    },
    pauseReplay: {
      group: "middleCenter",
      title: "Replay",
      key: "replay",
      ariaLabel: "Replay Game",
      order: 8,
      id: "replay",
      channel: buttonsChannel(screen),
      action: function action(_ref7) {
        var screen = _ref7.screen;
        var belowScreenKey = getScreenBelow(screen).scene.key;
        screen.navigate(screen.context.navigation[belowScreenKey].routes.restart);
        var params = pushLevelId(screen, ["level", "playagain"]);
        gmi.sendStatsEvent.apply(gmi, _toConsumableArray(params));
      }
    },
    play: {
      group: "middleCenter",
      title: "Play",
      key: "play",
      ariaLabel: "Play Game",
      order: 9,
      id: "play",
      channel: buttonsChannel(screen),
      action: function action() {
        gmi.sendStatsEvent("play", "click");
      }
    },
    pausePlay: {
      group: "middleCenter",
      title: "Play",
      key: "play",
      ariaLabel: "Play Game",
      order: 9,
      id: "play",
      channel: buttonsChannel(screen),
      action: function action(_ref8) {
        var screen = _ref8.screen;
        getScreenBelow(screen).scene.resume();
        gmi.sendStatsEvent("play", "click");
        screen.removeOverlay();
      }
    },
    next: {
      group: "middleRightSafe",
      title: "Next",
      key: "next",
      ariaLabel: "Next Item",
      order: 10,
      id: "next",
      channel: buttonsChannel(screen)
    },
    achievements: {
      group: "bottomLeft",
      title: "Achievements",
      key: "achievements",
      ariaLabel: "Your Achievements",
      order: 11,
      id: "achievements",
      channel: buttonsChannel(screen),
      indicator: {
        offsets: {
          mobile: {
            x: -12,
            y: 12
          },
          desktop: {
            x: -4,
            y: 4
          }
        }
      },
      action: function action(_ref9) {
        var screen = _ref9.screen;

        if (screen.navigation.achievements) {
          screen.navigation.achievements();
        } else {
          gmi.achievements.show();
        }

        screen.layout.buttons.achievements.setIndicator();
      }
    },
    achievementsSmall: {
      group: "topLeft",
      title: "Achievements",
      key: "achievements-small",
      ariaLabel: "Your Achievements",
      order: 12,
      id: "achievements-small",
      channel: buttonsChannel(screen),
      indicator: {
        offsets: {
          mobile: {
            x: -17,
            y: 17
          },
          desktop: {
            x: -12,
            y: 12
          }
        }
      },
      action: function action(_ref10) {
        var screen = _ref10.screen;

        if (screen.navigation.achievements) {
          screen.navigation.achievements();
        } else {
          gmi.achievements.show();
        }

        screen.layout.buttons.achievementsSmall.setIndicator();
      }
    },
    restart: {
      group: "bottomCenter",
      title: "Restart",
      key: "restart",
      ariaLabel: "Restart Game",
      order: 12,
      id: "restart",
      channel: buttonsChannel(screen),
      action: function action(_ref11) {
        var screen = _ref11.screen;
        var params = pushLevelId(screen, ["level", "playagain"]);
        gmi.sendStatsEvent.apply(gmi, _toConsumableArray(params));
      }
    },
    continue: {
      group: "bottomCenter",
      title: "Continue",
      key: "continue",
      ariaLabel: "Continue",
      order: 13,
      id: "continue",
      channel: buttonsChannel(screen)
    },
    continueGame: {
      group: "bottomCenter",
      title: "Continue",
      key: "continue",
      ariaLabel: "Continue Game",
      order: 13,
      id: "continue",
      channel: buttonsChannel(screen),
      action: function action(_ref12) {
        var screen = _ref12.screen;
        var params = pushLevelId(screen, ["level", "continue"]);
        gmi.sendStatsEvent.apply(gmi, _toConsumableArray(params));
      }
    },
    howToPlay: {
      group: "bottomRight",
      title: "How To Play",
      key: "how-to-play",
      ariaLabel: "Game Instructions",
      order: 14,
      id: "how-to-play",
      channel: buttonsChannel(screen),
      action: function action(_ref13) {
        var screen = _ref13.screen;
        screen.scene.pause();
        screen.addOverlay("how-to-play");
        gmi.sendStatsEvent("howtoplay", "click");
      }
    },
    debug: {
      group: "bottomCenter",
      title: "Debug",
      key: "debug",
      ariaLabel: "Debug",
      order: 15,
      id: "debug",
      channel: buttonsChannel(screen),
      action: function action(_ref14) {
        var screen = _ref14.screen;
        screen.navigation.debug();
      }
    }
  };
};