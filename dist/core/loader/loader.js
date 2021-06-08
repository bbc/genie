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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Loadscreen loads in the game's assets.
 *
 * @module components/loadscreen
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../screen.js";
import * as Scaler from "../scaler.js";
import * as GameSound from "../game-sound.js";
import { gmi } from "../gmi/gmi.js";
import { loadPack } from "./loadpack.js";
import { getConfig } from "./get-config.js";
import { isDebug } from "../debug/debug-mode.js";

var getMissingPacks = function getMissingPacks(masterPack, keys) {
  return Object.keys(keys).filter(function (key) {
    return ["default", "boot", "loader", "debug"].indexOf(key) === -1;
  }).filter(function (key) {
    return !masterPack.hasOwnProperty(key);
  }).map(function (key) {
    return "asset-packs/".concat(key);
  });
};

export var Loader = /*#__PURE__*/function (_Screen) {
  _inherits(Loader, _Screen);

  var _super = _createSuper(Loader);

  function Loader() {
    var _this;

    _classCallCheck(this, Loader);

    loadPack.path = gmi.gameDir + gmi.embedVars.configPath;
    _this = _super.call(this, {
      key: "loader",
      pack: loadPack
    });

    _defineProperty(_assertThisInitialized(_this), "updateLoadBar", function (progress) {
      if (progress >= _this._progress) {
        if (_this._progress === 0) gmi.gameLoaded();
        _this._progress = progress;
        _this._loadbar.frame.cutWidth = _this._loadbar.width * progress;

        _this._loadbar.frame.updateUVs();
      }

      if (window.__debug) {
        console.log("Loader progress:", progress); // eslint-disable-line no-console
      }
    });

    _this._loadbar = undefined;
    _this._progress = 0;
    return _this;
  }

  _createClass(Loader, [{
    key: "preload",
    value: function preload() {
      var _this2 = this;

      this.load.setBaseURL(gmi.gameDir);
      this.load.setPath(gmi.embedVars.configPath);
      var config = getConfig(this, "config/files");
      this.setConfig(config);

      if (config.theme.game && config.theme.game.achievements === true) {
        this.load.json5({
          key: "achievements-data",
          url: "achievements/config.json5"
        });
      }

      var masterPack = this.cache.json.get("asset-master-pack");
      var debugPack = isDebug() ? ["../../debug/debug-pack"] : [];
      var gamePacksToLoad = ["gel/gel-pack"].concat(getMissingPacks(masterPack, this.scene.manager.keys), debugPack);
      gamePacksToLoad.forEach(function (pack) {
        return _this2.load.pack(pack);
      });
      this.load.addPack(masterPack);
      this.add.image(0, 0, "loader.background");
      this.add.image(0, -120, "loader.title");
      this.createLoadBar();
      this.createBrandLogo();
      this.load.on("progress", this.updateLoadBar.bind(this));
    }
  }, {
    key: "createLoadBar",
    value: function createLoadBar() {
      this.add.image(0, 130, "loader.loadbarBackground");
      this._loadbar = this.add.image(0, 130, "loader.loadbar");
      this.updateLoadBar(0);
    }
  }, {
    key: "createBrandLogo",
    value: function createBrandLogo() {
      var metrics = Scaler.getMetrics();
      var x = metrics.horizontals.right - metrics.borderPad / metrics.scale;
      var y = metrics.verticals.bottom - metrics.borderPad / metrics.scale;
      this.brandLogo = this.add.image(x, y, "loader.brandLogo");
      this.brandLogo.setOrigin(1, 1);
    }
  }, {
    key: "create",
    value: function create() {
      GameSound.setButtonClickSound(this.scene.scene, "loader.buttonClick");

      if (this.context.config.theme.game && this.context.config.theme.game.achievements === true) {
        gmi.achievements.init(this.cache.json.get("achievements-data"));
      }

      this.navigation.next();
      gmi.sendStatsEvent("gameloaded", "true");
    }
  }]);

  return Loader;
}(Screen);