function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { eventBus } from "../event-bus.js";
import * as GameSound from "../game-sound.js";
import { gmi } from "../gmi/gmi.js";
import { assetPath } from "./asset-paths.js";
import { Indicator } from "./gel-indicator.js";
import { getMetrics } from "../scaler.js";
var defaults = {
  shiftX: 0,
  shiftY: 0
};
export var GelButton = /*#__PURE__*/function (_Phaser$GameObjects$C) {
  _inherits(GelButton, _Phaser$GameObjects$C);

  var _super = _createSuper(GelButton);

  function GelButton(scene, x, y, config) {
    var _this;

    _classCallCheck(this, GelButton);

    var metrics = getMetrics();
    _this = _super.call(this, scene, x, y);

    _defineProperty(_assertThisInitialized(_this), "overlays", {
      set: function set(key, asset) {
        _this.overlays.list[key] = asset;

        _this.add(_this.overlays.list[key]);
      },
      remove: function remove(key) {
        if (!_this.overlays.list[key]) {
          return;
        }

        _this.remove(_this.overlays.list[key]);

        _this.overlays.list[key].destroy();

        delete _this.overlays.list[key];
      },
      list: {}
    });

    _this.sprite = scene.add.sprite(0, 0, assetPath(Object.assign({}, config, {
      isMobile: metrics.isMobile
    })));

    _this.add(_this.sprite);

    _this.config = _objectSpread(_objectSpread({}, defaults), config);
    _this.isMobile = metrics.isMobile;
    config.indicator && _this.setIndicator();

    if (config.anim) {
      config.anim.frames = _this.scene.anims.generateFrameNumbers(config.anim.key);

      _this.scene.anims.create(config.anim);

      _this.sprite.play(config.anim.key);
    }

    _this.setInteractive({
      hitArea: _this.sprite,
      useHandCursor: true,
      hitAreaCallback: Phaser.Geom.Rectangle.Contains
    });

    _this.setHitArea(metrics);

    _this.setupMouseEvents(config, scene);

    return _this;
  }

  _createClass(GelButton, [{
    key: "onPointerUp",
    value: function onPointerUp(config, screen) {
      // Prevents button sounds from being paused by overlays (Pause Overlay specifically)
      GameSound.Assets.buttonClick.once(Phaser.Sound.Events.PAUSE, function () {
        GameSound.Assets.buttonClick.resume();
      });
      GameSound.Assets.buttonClick.play();
      var inputManager = this.scene.sys.game.input;
      inputManager.updateInputPlugins("", inputManager.pointers);
      publish(config, {
        screen: screen
      })();
    }
  }, {
    key: "setupMouseEvents",
    value: function setupMouseEvents(config, screen) {
      var _this2 = this;

      this.on("pointerup", function () {
        return _this2.onPointerUp(config, screen);
      });
      this.on("pointerout", function () {
        return _this2.sprite.setFrame(0);
      });
      this.on("pointerover", function () {
        return _this2.sprite.setFrame(1);
      });
    }
  }, {
    key: "setHitArea",
    value: function setHitArea(metrics) {
      var hitPad = Math.max(metrics.hitMin - this.sprite.width, metrics.hitMin - this.sprite.height, 0);
      var width = this.sprite.width + hitPad;
      var height = this.sprite.height + hitPad;
      this.input.hitArea = new Phaser.Geom.Rectangle(0, 0, width, height);
      this.setSize(width, height);
    }
  }, {
    key: "getHitAreaBounds",
    value: function getHitAreaBounds() {
      var wtm = this.getWorldTransformMatrix();
      var parentScale = this.parentContainer ? this.parentContainer.scale : 1;
      return new Phaser.Geom.Rectangle(wtm.getX(-this.input.hitArea.width / 2, 0), wtm.getY(0, -this.input.hitArea.height / 2), this.input.hitArea.width * this.scale * parentScale, this.input.hitArea.height * this.scale * parentScale);
    }
  }, {
    key: "setImage",
    value: function setImage(key) {
      this.config.key = key;
      this.sprite.setTexture(assetPath(_objectSpread(_objectSpread({}, this.config), {}, {
        key: key,
        isMobile: this.isMobile
      })));
    }
  }, {
    key: "resize",
    value: function resize(metrics) {
      this.isMobile = metrics.isMobile;
      this.sprite.setTexture(assetPath({
        key: this.config.key,
        isMobile: metrics.isMobile
      }));
      this.setHitArea(metrics);
      Object.values(this.overlays.list).filter(function (overlay) {
        return Boolean(overlay.resize);
      }).map(function (overlay) {
        return overlay.resize();
      });
    }
  }, {
    key: "setIndicator",
    value: function setIndicator() {
      this.overlays.remove("indicator");

      if (!gmi.achievements.unseen) {
        return;
      }

      this.overlays.set("indicator", new Indicator(this));
      this.overlays.list.indicator.resize();
    }
  }]);

  return GelButton;
}(Phaser.GameObjects.Container);

var publish = function publish(config, data) {
  return function () {
    eventBus.publish({
      channel: config.channel,
      name: config.id,
      data: data
    });
  };
};