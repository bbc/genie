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
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { Screen } from "../../core/screen.js";
import * as Rows from "../../core/layout/rows.js";
import { buttonsChannel } from "../../core/layout/gel-defaults.js";
import { eventBus } from "../../core/event-bus.js";
import { onScaleChange } from "../../core/scaler.js";
import { tweenRows, tweenRowBackdrops } from "./results-row-tween.js";
import { playRowAudio } from "./results-row-audio.js";
import { addParticlesToRows } from "./results-particles.js";
import { fireGameCompleteStat } from "./results-stats.js";
import { createRowBackdrops, scaleRowBackdrops } from "./results-row-backdrop.js";
export var Results = /*#__PURE__*/function (_Screen) {
  _inherits(Results, _Screen);

  var _super = _createSuper(Results);

  function Results() {
    _classCallCheck(this, Results);

    return _super.apply(this, arguments);
  }

  _createClass(Results, [{
    key: "create",
    value: function create() {
      this.addBackgroundItems();
      this.createLayout();
      this.createCentralBackdrop();
      this.createRows();
      this.subscribeToEventBus();
      fireGameCompleteStat(this.transientData[this.scene.key]);
      this.children.bringToTop(this.layout.root);
    }
  }, {
    key: "resultsArea",
    value: function resultsArea() {
      var safeArea = this.layout.getSafeArea({
        top: false
      });
      var center = Phaser.Geom.Rectangle.GetCenter(safeArea);
      this.backdrop && (safeArea.height = this.backdrop.height);
      return Phaser.Geom.Rectangle.CenterOn(safeArea, center.x, center.y);
    }
  }, {
    key: "createLayout",
    value: function createLayout() {
      var achievements = this.context.config.theme.game.achievements ? ["achievementsSmall"] : [];
      var buttons = ["pause", "restart", "continueGame"];
      this.setLayout(buttons.concat(achievements));
    }
  }, {
    key: "createRows",
    value: function createRows() {
      var _this = this;

      this.rows = Rows.create(this, function () {
        return _this.resultsArea();
      }, this.context.theme.rows, Rows.RowType.Results);
      this.rowBackdrops = createRowBackdrops(this, this.rows.containers);
      tweenRows(this, this.rows.containers);
      tweenRowBackdrops(this, this.rowBackdrops, this.rows.containers);
      playRowAudio(this, this.rows.containers);
      addParticlesToRows(this, this.rows.containers);
    }
  }, {
    key: "createCentralBackdrop",
    value: function createCentralBackdrop() {
      fp.get("backdrop.key", this.context.theme) && this.centralBackdropFill();
      this.resizeCentralBackdrop();
    }
  }, {
    key: "centralBackdropFill",
    value: function centralBackdropFill() {
      this.backdrop = this.add.image(0, 0, this.context.theme.backdrop.key);
      this.backdrop.alpha = this.context.theme.backdrop.alpha === undefined ? 1 : this.context.theme.backdrop.alpha;
    }
  }, {
    key: "resizeCentralBackdrop",
    value: function resizeCentralBackdrop() {
      var safeArea = this.resultsArea();

      if (fp.get("backdrop.key", this.context.theme) && safeArea) {
        this.backdrop.x = safeArea.centerX;
        this.backdrop.y = safeArea.centerY;
      }
    }
  }, {
    key: "subscribeToEventBus",
    value: function subscribeToEventBus() {
      var _this2 = this;

      var scaleEvent = onScaleChange.add(function () {
        _this2.resizeCentralBackdrop();

        scaleRowBackdrops(_this2.rowBackdrops, _this2.rows.containers);
      });
      this.events.once("shutdown", scaleEvent.unsubscribe);
      var fpMap = fp.map.convert({
        cap: false
      });
      fpMap(function (callback, name) {
        return eventBus.subscribe({
          name: name,
          callback: callback,
          channel: buttonsChannel(_this2)
        });
      }, {
        continue: this.navigation.continue,
        restart: this.navigation.restart
      });
    }
  }]);

  return Results;
}(Screen);