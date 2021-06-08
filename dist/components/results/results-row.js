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
import { ResultsText } from "./results-text.js";
import { ResultsSprite } from "./results-sprite.js";
import { ResultsSpine } from "./results-spine.js";
import { ResultsCountup } from "./results-countup.js";
export var ResultsRow = /*#__PURE__*/function (_Phaser$GameObjects$C) {
  _inherits(ResultsRow, _Phaser$GameObjects$C);

  var _super = _createSuper(ResultsRow);

  function ResultsRow(scene, rowConfig, getDrawArea) {
    var _this;

    _classCallCheck(this, ResultsRow);

    _this = _super.call(this, scene);
    _this.rowConfig = rowConfig;
    _this.getDrawArea = getDrawArea;

    _this.drawRow(scene);

    _this.setContainerPosition();

    _this.align();

    _this.setAlpha(rowConfig.alpha);

    return _this;
  }

  _createClass(ResultsRow, [{
    key: "setTextFromTemplate",
    value: function setTextFromTemplate(templateString, transientData) {
      var template = fp.template(templateString);
      this.text = template(transientData[this.scene.scene.key]);
      return this.text;
    }
  }, {
    key: "align",
    value: function align() {
      var lastGameObject = this.list.slice(-1)[0];
      var rowWidth = lastGameObject ? lastGameObject.x + lastGameObject.width : 0;
      this.list.forEach(function (gameObject) {
        return gameObject.x -= rowWidth / 2;
      });
    }
  }, {
    key: "addSection",
    value: function addSection(gameObject) {
      var offsetX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var offsetY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var lastGameObject = this.list.slice(-1)[0];
      gameObject.x = lastGameObject ? lastGameObject.x + lastGameObject.width : 0;
      gameObject.y -= gameObject.height / 2;
      gameObject.x += offsetX;
      gameObject.y += offsetY;
      this.add(gameObject);
    }
  }, {
    key: "drawRow",
    value: function drawRow(scene) {
      var _this2 = this;

      var rowText = "";
      var objectType = {
        text: ResultsText,
        sprite: ResultsSprite,
        spine: ResultsSpine,
        countup: ResultsCountup
      };
      this.rowConfig.format && this.rowConfig.format.forEach(function (object) {
        if (object.type === "text") {
          rowText = rowText + _this2.setTextFromTemplate(object.content, scene.transientData);
        }

        if (object.type === "countup") {
          rowText = rowText + _this2.setTextFromTemplate(object.endCount, scene.transientData);
        }

        _this2.config = {};
        _this2.config.ariaLabel = rowText;

        _this2.addSection(new objectType[object.type](_this2.scene, object), object.offsetX, object.offsetY);
      });
    }
  }, {
    key: "getBoundingRect",
    value: function getBoundingRect() {
      return this.getDrawArea();
    }
  }, {
    key: "setContainerPosition",
    value: function setContainerPosition() {
      var _this$getDrawArea = this.getDrawArea(),
          centerX = _this$getDrawArea.centerX,
          centerY = _this$getDrawArea.centerY;

      this.x = centerX;
      this.y = centerY;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.setContainerPosition();
    }
  }, {
    key: "makeAccessible",
    value: function makeAccessible() {}
  }]);

  return ResultsRow;
}(Phaser.GameObjects.Container);