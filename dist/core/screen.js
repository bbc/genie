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

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../lib/lodash/fp/fp.js";
import { gmi } from "./gmi/gmi.js";
import { buttonsChannel } from "./layout/gel-defaults.js";
import { eventBus } from "./event-bus.js";
import * as GameSound from "../core/game-sound.js";
import * as a11y from "../core/accessibility/accessibility-layer.js";
import * as Scaler from "./scaler.js";
import * as Layout from "./layout/layout.js";
import { settingsChannel } from "./settings.js";
import { furnish } from "./background-furniture.js";
import { isDebug } from "./debug/debug-mode.js";
import * as debug from "./debug/debug.js";
import { CAMERA_X, CAMERA_Y } from "./layout/metrics.js";

var getRoutingFn = function getRoutingFn(scene) {
  return function (route) {
    var routeTypes = {
      function: function _function() {
        return route(scene);
      },
      string: function string() {
        return scene.navigate(route);
      }
    };
    return routeTypes[_typeof(route)];
  };
};
/**
 * The `Screen` class extends `Phaser.State`, providing the `Context` to objects that extend from it.
 * All the game screens will extend from this class.
 */


export var Screen = /*#__PURE__*/function (_Phaser$Scene) {
  _inherits(Screen, _Phaser$Scene);

  var _super = _createSuper(Screen);

  function Screen(sceneConfig) {
    var _this;

    _classCallCheck(this, Screen);

    _this = _super.call(this, sceneConfig);

    _defineProperty(_assertThisInitialized(_this), "_makeNavigation", function () {
      var routes = _this.scene.key === "boot" ? {
        next: "loader"
      } : _this._data.navigation[_this.scene.key].routes;
      _this.navigation = fp.mapValues(getRoutingFn(_assertThisInitialized(_this)), routes);
    });

    _defineProperty(_assertThisInitialized(_this), "addBackgroundItems", furnish(_assertThisInitialized(_this)));

    _defineProperty(_assertThisInitialized(_this), "removeOverlay", function () {
      var parentScreen = _this._data.parentScreens.pop();

      parentScreen._onOverlayRemoved(_assertThisInitialized(_this));
    });

    _defineProperty(_assertThisInitialized(_this), "_onOverlayRemoved", function (overlay) {
      a11y.destroy();
      overlay.removeAll();
      overlay.scene.stop();

      _this._layout.makeAccessible();

      _this.sys.accessibleButtons.forEach(function (button) {
        return a11y.addButton(button);
      });

      a11y.reset();

      _this.setStatsScreen(_this.scene.key);

      eventBus.publish({
        channel: settingsChannel,
        name: "audio",
        data: gmi.getAllSettings().audio
      });
    });

    _defineProperty(_assertThisInitialized(_this), "removeAll", function () {
      eventBus.removeChannel(buttonsChannel(_assertThisInitialized(_this)));
      _this._layout && _this._layout.destroy();
      delete _this._layout;
    });

    _defineProperty(_assertThisInitialized(_this), "navigate", function (route) {
      _this.scene.bringToTop(route);

      while (_this._data.parentScreens.length > 0) {
        var parentScreen = _this._data.parentScreens.pop();

        parentScreen.removeAll();
        parentScreen.scene.stop();
      }

      _this.removeAll();

      _this.scene.start(route, _this._data);
    });

    return _this;
  }

  _createClass(Screen, [{
    key: "init",
    value: function init(data) {
      this._data = data;
      this.cameras.main.scrollX = -CAMERA_X;
      this.cameras.main.scrollY = -CAMERA_Y;

      if (this.scene.key !== "loader" && this.scene.key !== "boot") {
        this.setStatsScreen(this.scene.key);
        GameSound.setupScreenMusic(this);
        isDebug() && debug.addEvents(this);
      }

      this.sys.accessibleButtons = [];
      this.sys.accessibleGroups = [];
      a11y.destroy();

      this._makeNavigation();
    }
  }, {
    key: "setStatsScreen",
    value: function setStatsScreen(screen) {
      if (!this.context.theme.isOverlay) {
        gmi.setStatsScreen(screen);
      }
    }
  }, {
    key: "setData",
    value: function setData(newData) {
      this._data = newData;
    }
  }, {
    key: "setConfig",
    value: function setConfig(newConfig) {
      this._data.config = newConfig;
    }
  }, {
    key: "addOverlay",
    value: function addOverlay(key) {
      this._data.parentScreens.push(this);

      this.scene.run(key, this._data);
      this.scene.bringToTop(key);
    }
  }, {
    key: "setLayout",

    /**
     * Create a new GEL layout for a given set of Gel Buttons
     * Called in the create method of a given screen
     *
     * @example
     * this.setLayout(["home", "restart", "continue", "pause"]);
     * @param {Array} buttons - Array of standard button names to include. See {@link layout/gel-defaults.js} for available names
     * @param {Array} accessibleButtons - Array of standard button names to make accessible. By default, all are accessible.
     * @memberof module:screen
     * @returns {Object}
     */
    value: function setLayout(buttons, accessibleButtons) {
      this._layout = Layout.create(this, Scaler.getMetrics(), buttons, accessibleButtons);
      this.add.existing(this._layout.root);
      return this._layout;
    }
  }, {
    key: "context",
    get: function get() {
      return {
        config: this._data.config,
        theme: this._data.config.theme[this.scene.key],
        parentScreens: this._data.parentScreens,
        navigation: this._data.navigation,
        transientData: this._data.transient || {}
      };
    }
  }, {
    key: "layout",
    get: function get() {
      return this._layout;
    } //TODO P3 the only context parts we want them to set is transient data
    //TODO P3 maybe it should be separate? [NT]

  }, {
    key: "transientData",
    set: function set(newData) {
      this._data.transient = fp.merge(this._data.transient, newData, {});
    },
    get: function get() {
      return this._data.transient;
    }
  }, {
    key: "assetPrefix",
    get: function get() {
      return this.context.theme.assetPrefix || this.scene.key;
    }
  }]);

  return Screen;
}(Phaser.Scene);