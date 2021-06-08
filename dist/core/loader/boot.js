function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * Pre-booter for assets needed by loadscreen and general early game setup
 *
 * @module components/loadscreen
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../screen.js";
import { gmi } from "../gmi/gmi.js";
import { settings, settingsChannel } from "../../core/settings.js";
import { eventBus } from "../../core/event-bus.js";
import fp from "../../../lib/lodash/fp/fp.js";
import * as Scaler from "../scaler.js"; //const triggeredByGame = arg => arg instanceof Phaser.Game;

var setImage = function setImage(button) {
  return button.setImage(settings.getAllSettings().audio ? "audio-on" : "audio-off");
};

var getAudioButtons = fp.map(fp.get("layout.buttons.audio"));
export var Boot = /*#__PURE__*/function (_Screen) {
  _inherits(Boot, _Screen);

  var _super = _createSuper(Boot);

  function Boot(navigationConfig) {
    var _this;

    _classCallCheck(this, Boot);

    _this = _super.call(this, {
      key: "boot"
    });
    _this._navigationConfig = navigationConfig;
    _this._navigationConfig.boot = {
      routes: {
        next: "loader"
      }
    };
    _this._navigationConfig.loader = {
      routes: {
        next: "home"
      }
    };
    return _this;
  }

  _createClass(Boot, [{
    key: "preload",
    value: function preload() {
      var _this2 = this;

      this.load.setBaseURL(gmi.gameDir);
      this.load.setPath(gmi.embedVars.configPath);
      this.load.pack("config/files"); //TODO P3 this is loaded now so we can check its keys for missing files. It is also loaded again later so perhaps could be done then? NT

      this.load.json("asset-master-pack", "asset-packs/asset-master-pack.json");
      this.setData({
        parentScreens: [],
        transient: {},
        navigation: this._navigationConfig
      }); //TODO P3 - if the above could be changed this could potentially be part of loadscreen.js and we could delete boot

      eventBus.subscribe({
        channel: settingsChannel,
        name: "settings-closed",
        callback: function callback() {
          _this2.game.canvas.focus();
        }
      });
      this.configureAudioSetting();
    }
  }, {
    key: "configureAudioSetting",
    value: function configureAudioSetting() {
      var _this3 = this;

      eventBus.subscribe({
        channel: settingsChannel,
        name: "audio",
        callback: function callback() {
          var audioEnabled = settings.getAllSettings().audio;
          _this3.sound.mute = !audioEnabled;

          var activeScenes = _this3.scene.manager.getScenes(false);

          fp.map(setImage, getAudioButtons(activeScenes).filter(Boolean));
        }
      });
    }
  }, {
    key: "create",
    value: function create() {
      //TODO P3 these could be set using this.game on loadscreen?
      this.game.canvas.setAttribute("tabindex", "-1");
      this.game.canvas.setAttribute("aria-hidden", "true"); //TODO P3 where should this now live? [NT]
      //TODO P3 mainly just initialises scaler now?

      Scaler.init(600, this.game);
      this.navigation.next();
    }
  }]);

  return Boot;
}(Screen);