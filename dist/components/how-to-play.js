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
 * Select gives a choice of different items, which can be configured in main.js.
 *
 * @module components/select
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../lib/lodash/fp/fp.js";
import { buttonsChannel } from "../core/layout/gel-defaults.js";
import { Screen } from "../core/screen.js";
import { eventBus } from "../core/event-bus.js";
import * as accessibleCarouselElements from "../core/accessibility/accessible-carousel-elements.js";
import { gmi } from "../core/gmi/gmi.js";

var wrapRange = function wrapRange(value, max) {
  return (value % max + max) % max;
};

export var HowToPlay = /*#__PURE__*/function (_Screen) {
  _inherits(HowToPlay, _Screen);

  var _super = _createSuper(HowToPlay);

  function HowToPlay() {
    _classCallCheck(this, HowToPlay);

    return _super.apply(this, arguments);
  }

  _createClass(HowToPlay, [{
    key: "create",
    value: function create() {
      this.addBackgroundItems();
      this.currentIndex = 0;
      this.choiceSprites = this.createChoiceSprites(this.context.theme.choices);
      this.setLayout(["overlayBack", "audio", "settings", "previous", "next"]);
      this.setButtonVisibility();
      this.accessibleCarouselElements = accessibleCarouselElements.create(this.scene.key, this.choiceSprites, this.game.canvas.parentElement, this.context.theme.choices);
      this.addEventSubscriptions();
    }
  }, {
    key: "setButtonVisibility",
    value: function setButtonVisibility() {
      this.layout.buttons.previous.visible = Boolean(this.currentIndex !== 0);
      var isNotLastPage = this.currentIndex + 1 !== this.choiceSprites.length;
      this.layout.buttons.next.visible = Boolean(isNotLastPage);
      this.layout.buttons.previous.accessibleElement.update();
      this.layout.buttons.next.accessibleElement.update();
    }
  }, {
    key: "focusOnButton",
    value: function focusOnButton(buttonName) {
      var button = this.layout.buttons[buttonName];
      button.accessibleElement.el.focus();
    }
  }, {
    key: "setButtonFocus",
    value: function setButtonFocus() {
      if (this.currentIndex === 0) {
        this.focusOnButton("next");
      }

      if (this.currentIndex === this.choiceSprites.length - 1) {
        this.focusOnButton("previous");
      }
    }
  }, {
    key: "createChoiceSprites",
    value: function createChoiceSprites(choices) {
      var _this = this;

      var choiceSprites = [];
      choices.forEach(function (item, index) {
        var choiceAsset = "".concat(_this.scene.key, ".").concat(choices[index].asset);

        var choiceSprite = _this.add.sprite(0, 30, choiceAsset);

        choiceSprite.visible = index === 0;
        choiceSprites.push(choiceSprite);
      });
      return choiceSprites;
    }
  }, {
    key: "handleLeftButton",
    value: function handleLeftButton() {
      this.currentIndex = wrapRange(--this.currentIndex, this.choiceSprites.length);
      this.showChoice();
      this.setButtonVisibility();
      this.setButtonFocus();
    }
  }, {
    key: "handleRightButton",
    value: function handleRightButton() {
      this.currentIndex = wrapRange(++this.currentIndex, this.choiceSprites.length);
      this.showChoice();
      this.setButtonVisibility();
      this.setButtonFocus();
    }
  }, {
    key: "showChoice",
    value: function showChoice() {
      var _this2 = this;

      this.choiceSprites.forEach(function (item, index) {
        item.visible = index === _this2.currentIndex;
      });
      this.accessibleCarouselElements.forEach(function (element, index) {
        element.setAttribute("aria-hidden", index !== _this2.currentIndex);
        element.style.display = index !== _this2.currentIndex ? "none" : "block"; //Needed for Firefox
      });
    }
  }, {
    key: "startGame",
    value: function startGame() {
      var theme = this.context.config.theme[this.scene.key];
      var metaData = {
        metadata: "ELE=[".concat(theme.choices[this.currentIndex].title, "]")
      };
      var screenType = this.scene.key.split("-")[0];
      gmi.sendStatsEvent(screenType, "select", metaData);
      var choice = this.context.config.theme[this.scene.key].choices[this.currentIndex];
      this.transientData[this.scene.key] = {
        choice: choice,
        index: this.currentIndex
      };
      this.navigation.next();
    }
  }, {
    key: "addEventSubscriptions",
    value: function addEventSubscriptions() {
      var _this3 = this;

      var fpMap = fp.map.convert({
        cap: false
      });
      fpMap(function (callback, name) {
        return eventBus.subscribe({
          name: name,
          callback: callback,
          channel: buttonsChannel(_this3)
        });
      }, {
        previous: this.handleLeftButton.bind(this),
        next: this.handleRightButton.bind(this),
        continue: this.startGame.bind(this),
        pause: function pause() {
          // stops screenreader from announcing the options when the pause overlay is covering them
          _this3.accessibleCarouselElements.forEach(function (element) {
            element.setAttribute("aria-hidden", true);
          });
        },
        play: function play() {
          // makes the screenreader announce the selected option
          _this3.accessibleCarouselElements[_this3.currentIndex].setAttribute("aria-hidden", false);
        }
      });
    }
  }]);

  return HowToPlay;
}(Screen);