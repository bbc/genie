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
 * Select gives a choice of different items, which can be configured in main.js.
 *
 * @module components/select
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../core/screen.js";
import { onScaleChange } from "../../core/scaler.js";
import { GelGrid } from "../../core/layout/grid/grid.js";
import * as state from "../../core/state.js";
import fp from "../../../lib/lodash/fp/fp.js";
import { createTitles } from "./titles.js";
import * as singleItemMode from "./single-item-mode.js";
import { addEvents } from "./add-events.js";
import { gmi } from "../../core/gmi/gmi.js";
import { addHoverParticlesToCells } from "./select-particles.js";
var gridDefaults = {
  tabIndex: 6
};

var getOnTransitionStartFn = function getOnTransitionStartFn(scene) {
  return function () {
    if (!scene.layout.buttons.continue) return;
    var bool = scene.currentEnabled();
    scene.layout.buttons.continue.input.enabled = bool;
    scene.layout.buttons.continue.alpha = bool ? 1 : 0.5;
  };
};

export var Select = /*#__PURE__*/function (_Screen) {
  _inherits(Select, _Screen);

  var _super = _createSuper(Select);

  function Select() {
    var _this;

    _classCallCheck(this, Select);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "next", function (getSelection) {
      return function () {
        _this._scaleEvent.unsubscribe();

        var selection = getSelection.call(_this.grid);
        var metaData = {
          metadata: "ELE=[".concat(selection.title, "]")
        };

        var screenType = _this.scene.key.split("-")[0];

        gmi.sendStatsEvent(screenType, "select", metaData);
        _this.transientData[_this.scene.key] = {
          choice: selection
        };

        _this.navigation.next();
      };
    });

    return _this;
  }

  _createClass(Select, [{
    key: "create",
    value: function create() {
      this.addBackgroundItems();
      createTitles(this);
      var buttons = ["home", "pause", "previous", "next"];
      singleItemMode.isEnabled(this) ? this.setLayout(buttons.concat("continue"), ["home", "pause"]) : this.setLayout(buttons, ["home", "pause", "next", "previous"]);
      var onTransitionStart = getOnTransitionStartFn(this);
      this.grid = new GelGrid(this, Object.assign(this.context.theme, gridDefaults, {
        onTransitionStart: onTransitionStart
      }));
      this.resize();
      this._cells = this.grid.addGridCells(this.context.theme);
      this.layout.addCustomGroup("grid", this.grid, gridDefaults.tabIndex);
      this._scaleEvent = onScaleChange.add(this.resize.bind(this));
      this.scene.scene.events.on("shutdown", this._scaleEvent.unsubscribe, this);
      addEvents(this);
      var stateConfig = this.context.theme.choices.map(function (_ref) {
        var id = _ref.id,
            state = _ref.state;
        return {
          id: id,
          state: state
        };
      });
      this.states = state.create(this.context.theme.storageKey, stateConfig);
      singleItemMode.create(this);
      this.updateStates();
      onTransitionStart();
      addHoverParticlesToCells(this, this._cells, this.context.theme.onHoverParticles, this.layout.root);
    }
  }, {
    key: "updateStates",
    value: function updateStates() {
      var _this2 = this;

      var storedStates = this.states.getAll().filter(function (config) {
        return Boolean(config.state);
      });
      var cells = fp.keyBy(function (cell) {
        return cell.button.config.id;
      }, this._cells);
      storedStates.forEach(function (stored) {
        var config = _this2.context.theme.states[stored.state];
        var button = cells[stored.id].button;
        button.overlays.set("state", _this2.add.sprite(config.x, config.y, config.overlayAsset));
        config.asset && button.setImage(config.asset);
        config.properties && Object.assign(button.sprite, config.properties);
        config.suffix && (button.config.ariaLabel = [button.config.ariaLabel, config.suffix].join(" "));
        button.input.enabled = Boolean(config.enabled !== false);
        button.accessibleElement.update();
      }, this);
    }
  }, {
    key: "resize",
    value: function resize() {
      this.grid.resize(this.layout.getSafeArea());
    }
  }, {
    key: "currentEnabled",
    value: function currentEnabled() {
      var currentState = this.states.get(this.grid.getCurrentPageKey()).state;
      var stateDefinition = this.context.theme.states[currentState];
      return stateDefinition === undefined || stateDefinition.enabled !== false;
    }
  }]);

  return Select;
}(Screen);