function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
import fp from "../../../lib/lodash/fp/fp.js";
import * as a11y from "../accessibility/accessibility-layer.js";
import * as ButtonFactory from "./button-factory.js";
var horizontal = {
  left: function left(metrics, group, horizontalsType) {
    var hitAreaOffset = 0;
    fp.forEach(function (child) {
      if (!child.input.hitArea) return;
      hitAreaOffset = fp.max([hitAreaOffset, -(child.x - child.input.hitArea.width / 2) / metrics.scale]);
    }, group.list);
    group.x = metrics[horizontalsType].left + metrics.borderPad + hitAreaOffset;
  },
  center: function center(metrics, group, horizontalsType) {
    group.x = metrics[horizontalsType].center - group.width / 2;
  },
  right: function right(metrics, group, horizontalsType) {
    var hitAreaOffset = 0;
    fp.forEach(function (child) {
      if (!child.input.hitArea) return;
      hitAreaOffset = fp.max([hitAreaOffset, (child.x + child.input.hitArea.width / 2) / metrics.scale - group.width]);
    }, group.list);
    group.x = metrics[horizontalsType].right - metrics.borderPad - hitAreaOffset - group.width;
  }
};
var vertical = {
  top: function top(metrics, group) {
    var hitAreaOffset = 0;
    fp.forEach(function (child) {
      if (!child.input.hitArea) return;
      hitAreaOffset = fp.max([hitAreaOffset, -(child.y - child.input.hitArea.height / 2) / metrics.scale]);
    }, group.list);
    group.y = metrics.verticals.top + metrics.borderPad + hitAreaOffset;
  },
  middle: function middle(metrics, group) {
    group.y = metrics.verticals.middle - group.height / 2;
  },
  bottom: function bottom(metrics, group) {
    var hitAreaOffset = 0;
    fp.forEach(function (child) {
      if (!child.input.hitArea) return;
      hitAreaOffset = fp.max([hitAreaOffset, (child.y + child.input.hitArea.height / 2) / metrics.scale - group.height]);
    }, group.list);
    group.y = metrics.verticals.bottom - metrics.borderPad - hitAreaOffset - group.height;
  }
};
export var GelGroup = /*#__PURE__*/function (_Phaser$GameObjects$C) {
  _inherits(GelGroup, _Phaser$GameObjects$C);

  var _super = _createSuper(GelGroup);

  function GelGroup(scene, parent, vPos, hPos, metrics, isSafe) {
    var _this;

    var isVertical = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

    _classCallCheck(this, GelGroup);

    _this = _super.call(this, scene, 0, 0); //TODO P3 we used to name the groups - useful for debugging. Might be useful as a property? [NT]
    //super(game, parent, fp.camelCase([vPos, hPos, isVertical ? "v" : ""].join(" ")));

    _this._vPos = vPos;
    _this._hPos = hPos;
    _this._metrics = metrics;
    _this._isSafe = isSafe;
    _this._isVertical = isVertical;
    _this._buttons = [];
    _this._buttonFactory = ButtonFactory.create(scene);

    _this._setGroupPosition = function (metrics) {
      //TODO change this to returns e.g: this.y = vertical[vPos](metrics, this);
      horizontal[hPos](metrics, _assertThisInitialized(_this), isSafe ? "safeHorizontals" : "horizontals");
      vertical[vPos](metrics, _assertThisInitialized(_this));
    };

    _this.makeAccessible();

    return _this;
  }

  _createClass(GelGroup, [{
    key: "addButton",
    value: function addButton(config) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._buttons.length;

      var newButton = this._buttonFactory.createButton(config, this.width / 2, this.height / 2);

      this.addAt(newButton, position);

      this._buttons.push(newButton);

      this.reset(this._metrics);
      return newButton;
    }
  }, {
    key: "getBoundingRect",
    value: function getBoundingRect() {
      return new Phaser.Geom.Rectangle(this.x, this.y, this.width, this.height);
    }
  }, {
    key: "removeButton",
    value: function removeButton(buttonToRemove) {
      this._buttons = fp.remove(function (n) {
        return n === buttonToRemove;
      }, this._buttons);
      buttonToRemove.destroy();
    }
  }, {
    key: "addToGroup",
    value: function addToGroup(item) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      this.addAt(item, position);
      this.reset();
    }
  }, {
    key: "reset",
    value: function reset(metrics) {
      metrics = metrics || this._metrics;
      this.resetButtons(metrics);
      this.alignChildren();
      this._metrics = metrics;
      var invScale = 1 / metrics.scale;
      this.setScale(invScale);
      this.updateSize();

      this._setGroupPosition(metrics);

      this._buttons.forEach(function (button) {
        button.x = button.x + button.config.shiftX * metrics.scale;
        button.y = button.y + button.config.shiftY * metrics.scale;
      });
    }
  }, {
    key: "updateSize",
    value: function updateSize() {
      var childBounds = this.list.map(function (child) {
        return child.getHitAreaBounds();
      });
      var left = childBounds[0] ? Math.min.apply(Math, _toConsumableArray(childBounds.map(function (bounds) {
        return bounds.x;
      }))) : 0;
      var right = childBounds[0] ? Math.max.apply(Math, _toConsumableArray(childBounds.map(function (bounds) {
        return bounds.x + bounds.width;
      }))) : 0;
      var top = childBounds[0] ? Math.min.apply(Math, _toConsumableArray(childBounds.map(function (bounds) {
        return bounds.y;
      }))) : 0;
      var bottom = childBounds[0] ? Math.max.apply(Math, _toConsumableArray(childBounds.map(function (bounds) {
        return bounds.y + bounds.height;
      }))) : 0;
      this.setSize(right - left, bottom - top);
    }
  }, {
    key: "alignChildren",
    value: function alignChildren() {
      var _this2 = this;

      var pos = {
        x: 0,
        y: 0
      };
      var childList = this.list.map(function (x) {
        return x;
      });
      childList.sort(function (a, b) {
        return b.height - a.height;
      });
      this.iterate(function (child) {
        child.y = pos.y + childList[0].height / 2;

        if (_this2._isVertical) {
          child.x = 0;
          pos.y += child.height + Math.max(0, _this2._metrics.buttonPad - child.height + child.sprite.height);
        } else {
          child.x = pos.x + child.width / 2;
          pos.x += child.width + Math.max(0, _this2._metrics.buttonPad - child.width + child.sprite.width);
        }
      }, this);
    }
  }, {
    key: "makeAccessible",
    value: function makeAccessible() {
      a11y.addGroupAt(fp.camelCase([this._vPos, this._hPos, this._isVertical ? "v" : "", this._isSafe ? "safe" : ""].join("-")));

      this._buttons.forEach(a11y.addButton);
    } //TODO this is currently observer pattern but will eventually use pub/sub Phaser.Events

  }, {
    key: "resetButtons",
    value: function resetButtons(metrics) {
      this._buttons.forEach(function (button) {
        return button.resize(metrics);
      });
    }
  }]);

  return GelGroup;
}(Phaser.GameObjects.Container);