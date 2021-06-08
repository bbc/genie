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
var COUNTUP_STATE = {
  DELAYED: 0,
  COUNTING: 1,
  ENDED: 2
};
export var ResultsCountup = /*#__PURE__*/function (_Phaser$GameObjects$T) {
  _inherits(ResultsCountup, _Phaser$GameObjects$T);

  var _super = _createSuper(ResultsCountup);

  function ResultsCountup(scene, config) {
    var _this;

    _classCallCheck(this, ResultsCountup);

    _this = _super.call(this, scene, 0, 0, undefined, config.textStyle);
    _this.config = config;
    _this.startCount = _this.textFromTemplate(config.startCount, scene.transientData);
    _this.endCount = _this.textFromTemplate(config.endCount, scene.transientData);

    _this.initialise();

    _this.setTextAndFixedSize();

    _this.startUpdateLoop(scene);

    return _this;
  }

  _createClass(ResultsCountup, [{
    key: "initialise",
    value: function initialise() {
      this.delayProgress = 0;
      this.numberOfTicks = 0;
      this.currentValue = parseInt(this.startCount);
      this.countupRange = this.endCount - this.startCount;
      this.shouldSingleTick = this.config.audio ? this.countupRange <= this.config.audio.singleTicksRange : false;
    }
  }, {
    key: "setTextAndFixedSize",
    value: function setTextAndFixedSize() {
      this.text = this.startCount;
      this.setFixedSize(this.getFinalWidth(this.endCount), 0);
    }
  }, {
    key: "startUpdateLoop",
    value: function startUpdateLoop(scene) {
      var _this2 = this;

      this.countupState = COUNTUP_STATE.DELAYED;
      this.boundUpdateFn = this.update.bind(this);
      scene.events.on("update", this.boundUpdateFn);
      scene.events.once("shutdown", function () {
        scene.events.off("update", _this2.boundUpdateFn);
      });
    }
  }, {
    key: "getFinalWidth",
    value: function getFinalWidth(finalText) {
      var text = this.text;
      this.text = finalText;
      var width = this.width;
      this.text = text;
      return width;
    }
  }, {
    key: "textFromTemplate",
    value: function textFromTemplate(templateString, transientData) {
      var template = fp.template(templateString);
      return template(transientData[this.scene.scene.key]);
    }
  }, {
    key: "update",
    value: function update(_, dt) {
      if (this.countupState === COUNTUP_STATE.DELAYED) {
        this.incrementDelayCount(dt, this.config.startDelay);
      }

      if (this.countupState === COUNTUP_STATE.COUNTING) {
        this.incrementCount(dt, this.config);
      }
    }
  }, {
    key: "incrementDelayCount",
    value: function incrementDelayCount(dt, delay) {
      this.delayProgress += dt;

      if (this.delayProgress > delay) {
        this.countupState = COUNTUP_STATE.COUNTING;
      }
    }
  }, {
    key: "canPlaySound",
    value: function canPlaySound(progress, ticksPerSecond, countupDuration) {
      if (ticksPerSecond && !this.shouldSingleTick) {
        var expectedNumberOfTicks = progress * ticksPerSecond * countupDuration / 1000;
        return expectedNumberOfTicks > this.numberOfTicks ? true : false;
      }

      return this.text !== this.previousText ? true : false;
    }
  }, {
    key: "playAudio",
    value: function playAudio(progress) {
      var startRate = this.config.audio.startPlayRate || 1;
      var endRate = this.config.audio.endPlayRate || 1;
      var currentRate = startRate + progress * (endRate - startRate);
      this.scene.sound.play(this.config.audio.key, {
        rate: currentRate
      });
      this.numberOfTicks += 1;
    }
  }, {
    key: "incrementCount",
    value: function incrementCount(dt, config) {
      this.currentValue += dt / config.countupDuration * this.countupRange;
      this.previousText = this.text;
      this.text = parseInt(this.currentValue);

      if (this.currentValue >= this.endCount) {
        this.text = this.endCount;
        this.countupState = COUNTUP_STATE.ENDED;
      }

      var progress = (this.currentValue - this.startCount) / (this.endCount - this.startCount);

      if (this.config.audio && this.canPlaySound(progress, config.audio.ticksPerSecond, config.countupDuration)) {
        this.playAudio(progress);
      }
    }
  }]);

  return ResultsCountup;
}(Phaser.GameObjects.Text);