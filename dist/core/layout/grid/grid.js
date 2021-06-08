function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createCell } from "./cell.js";
import * as a11y from "../../accessibility/accessibility-layer.js";
import { getMetrics } from "../../../core/scaler.js";
var defaults = {
  rows: 1,
  columns: 1,
  ease: "Cubic.easeInOut",
  duration: 500,
  align: "center",
  onTransitionStart: function onTransitionStart() {}
};

var resetCell = function resetCell(cell) {
  return cell.reset();
};

export var GelGrid = /*#__PURE__*/function (_Phaser$GameObjects$C) {
  _inherits(GelGrid, _Phaser$GameObjects$C);

  var _super = _createSuper(GelGrid);

  function GelGrid(scene, config) {
    var _this;

    _classCallCheck(this, GelGrid);

    _this = _super.call(this, scene, 0, 0);
    var metrics = getMetrics();
    _this._safeArea = scene.layout.getSafeArea(metrics);
    _this._config = _objectSpread(_objectSpread({}, defaults), config);
    _this._cells = [];
    _this._cellPadding = metrics.isMobile ? 16 : 24;
    _this.page = 0;
    _this.eventChannel = "gel-buttons-".concat(scene.scene.key);

    _this.enforceLimits();

    return _this;
  }

  _createClass(GelGrid, [{
    key: "addGridCells",
    value: function addGridCells(theme) {
      var _this2 = this;

      this._cells = theme.choices.map(function (cell, idx) {
        return createCell(_this2, cell, idx, theme);
      });
      this.makeAccessible();
      return this._cells;
    }
  }, {
    key: "calculateCellSize",
    value: function calculateCellSize() {
      var scaleX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var scaleY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var colPaddingCount = this._config.columns - 1;
      var rowPaddingCount = this._config.rows - 1;
      var paddingAdjustmentX = colPaddingCount * this._cellPadding;
      var paddingAdjustmentY = rowPaddingCount * this._cellPadding;
      return [scaleX * ((this._safeArea.width - paddingAdjustmentX) / this._config.columns), scaleY * ((this._safeArea.height - paddingAdjustmentY) / this._config.rows)];
    }
  }, {
    key: "resize",
    value: function resize(safeArea) {
      var metrics = getMetrics();
      this._safeArea = safeArea;
      this._cellPadding = metrics.screenToCanvas(metrics.isMobile ? 16 : 24);
      this.reset();
    }
  }, {
    key: "cellIds",
    value: function cellIds() {
      return this._cells.map(function (cell) {
        return cell.button.config.id;
      });
    }
  }, {
    key: "choices",
    value: function choices() {
      return this._cells.map(function (cell) {
        return {
          title: cell.button.config.title,
          id: cell.button.config.id
        };
      });
    }
  }, {
    key: "getCurrentSelection",
    value: function getCurrentSelection() {
      return this.choices()[this.page];
    }
  }, {
    key: "enforceLimits",
    value: function enforceLimits() {
      var maxColumns = this._config.rows === 1 ? 4 : 3;
      var maxRows = 2;
      this._config.columns = Math.min(this._config.columns, maxColumns);
      this._config.rows = Math.min(maxRows, this._config.rows);
      this.cellsPerPage = this._config.rows * this._config.columns;
    }
  }, {
    key: "getBoundingRect",
    value: function getBoundingRect() {
      return this._safeArea;
    }
  }, {
    key: "getPageCount",
    value: function getPageCount() {
      return Math.ceil(this._cells.length / this.cellsPerPage);
    }
  }, {
    key: "makeAccessible",
    value: function makeAccessible() {
      a11y.addGroupAt("grid", this._config.tabIndex);

      this._cells.forEach(function (cell) {
        return cell.makeAccessible();
      });

      this.reset();
    }
  }, {
    key: "shouldGoForwards",
    value: function shouldGoForwards(nextPageNum, currentPage, pageCount) {
      var isSingleItem = this._config.columns === 1 && this._config.rows === 1;

      if (isSingleItem) {
        var isFirstPageLoopingBackwards = pageCount === nextPageNum + 1 && currentPage === 0;
        var isLastPageLoopingForwards = pageCount === currentPage + 1 && nextPageNum === 0;

        if (isFirstPageLoopingBackwards) {
          return false;
        }

        if (isLastPageLoopingForwards) {
          return true;
        }
      }

      return nextPageNum > currentPage;
    }
  }, {
    key: "showPage",
    value: function showPage(nextPageNum) {
      var _this3 = this;

      if (this.page === nextPageNum) {
        return;
      }

      var currentPage = this.page;
      var pageCount = this.getPageCount();
      var goForwards = this.shouldGoForwards(nextPageNum, currentPage, pageCount);
      this.page = (nextPageNum + pageCount) % pageCount;
      this.reset();
      this.setPageVisibility(currentPage, true);
      this.scene.input.enabled = false;

      this._config.onTransitionStart();

      this.getPageCells(this.page).forEach(function (cell) {
        return cell.addTweens(_objectSpread(_objectSpread({}, _this3._config), {}, {
          tweenIn: true,
          goForwards: goForwards
        }));
      });
      this.getPageCells(currentPage).forEach(function (cell) {
        return cell.addTweens(_objectSpread(_objectSpread({}, _this3._config), {}, {
          tweenIn: false,
          goForwards: goForwards
        }));
      });
      this.scene.time.addEvent({
        delay: this._config.duration + 1,
        callback: this.transitionCallback,
        callbackScope: this,
        args: [currentPage]
      });
    }
  }, {
    key: "transitionCallback",
    value: function transitionCallback(pageToDisable) {
      if (this.page === pageToDisable) {
        return;
      }

      this.setPageVisibility(pageToDisable, false);
      this.scene.input.enabled = true;
    }
  }, {
    key: "getCurrentPageKey",
    value: function getCurrentPageKey() {
      return this._cells[this.page].button.key;
    }
  }, {
    key: "setPageVisibility",
    value: function setPageVisibility(pageNum, visibility) {
      var _this4 = this;

      this.getPageCells(pageNum).forEach(function (cell) {
        cell.button.visible = visibility;
        _this4.cellsPerPage > 1 && (cell.button.config.tabbable = visibility);
        cell.button.accessibleElement.update();
      });
    }
  }, {
    key: "getPageCells",
    value: function getPageCells(pageNum) {
      var pageMax = this.cellsPerPage * (pageNum + 1);
      var pageMin = this.cellsPerPage * pageNum;
      return this._cells.filter(function (cell, idx) {
        return idx >= pageMin && idx < pageMax;
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      this._cellSize = this.calculateCellSize();

      this._cells.forEach(resetCell);

      this.setPageVisibility(this.page, true);
    }
  }]);

  return GelGrid;
}(Phaser.GameObjects.Container);