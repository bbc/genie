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
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../core/screen.js";
import { accessibilify } from "../core/accessibility/accessibilify.js";
import { gmi } from "../core/gmi/gmi.js";
import * as state from "../core/state.js";
export var Game = /*#__PURE__*/function (_Screen) {
  _inherits(Game, _Screen);

  var _super = _createSuper(Game);

  function Game() {
    _classCallCheck(this, Game);

    return _super.apply(this, arguments);
  }

  _createClass(Game, [{
    key: "calculateAchievements",
    value: function calculateAchievements(item, amount, keys) {
      if (amount === 1) {
        gmi.achievements.set({
          key: keys[0]
        });
      }

      if (amount === 5) {
        gmi.achievements.set({
          key: keys[1]
        });
      }

      if (amount === 10) {
        gmi.achievements.set({
          key: keys[2]
        });
      }

      if (amount === 20 && item === "gem") {
        gmi.achievements.set({
          key: keys[3]
        });
      }
    }
  }, {
    key: "getAchievements",
    value: function getAchievements() {
      var achievements = this.cache.json.get("achievements-data").map(function (achievement) {
        return achievement.key;
      });
      return {
        star: achievements.slice(0, 3),
        gem: achievements.slice(3, 7),
        key: achievements.slice(7, 10)
      };
    }
  }, {
    key: "create",
    value: function create() {
      var _this = this;

      var achievementNames = this.getAchievements();
      var keys = 0;
      var gems = 0;
      var stars = 0;
      this.add.image(0, 0, "home.background");
      this.addBackgroundItems();
      this.add.text(0, -190, "Test Game: Collect Items", {
        font: "65px ReithSans",
        fill: "#f6931e",
        align: "center"
      }).setOrigin(0.5);
      this.setLayout(["pause"]);
      var buttonKey = "".concat(this.assetPrefix, ".basicButton");
      var buttonTextStyle = {
        font: "35px ReithSans",
        fill: "#fff",
        align: "center",
        wordWrap: true,
        wordWrapWidth: 223
      };
      var buttonNames = ["Star", "Gem", "Key"];
      var starImage = this.add.image(0, -70, "".concat(this.assetPrefix, ".star"));
      var gemImage = this.add.image(0, 20, "".concat(this.assetPrefix, ".gem"));
      var keyImage = this.add.image(0, 110, "".concat(this.assetPrefix, ".key"));
      var starScore = this.add.text(-50, -70, "0", buttonTextStyle).setOrigin(0.5);
      var gemScore = this.add.text(-50, 20, "0", buttonTextStyle).setOrigin(0.5);
      var keyScore = this.add.text(-50, 110, "0", buttonTextStyle).setOrigin(0.5);
      this.add.image(300, 20, buttonKey).setOrigin(0.5).setInteractive({
        useHandCursor: true
      }).on("pointerup", function () {
        return onGameComplete();
      });
      this.add.text(300, 20, "Continue", buttonTextStyle).setOrigin(0.5).setInteractive({
        useHandCursor: true
      }).on("pointerup", function () {
        return onGameComplete();
      });
      [-70, 20, 110].forEach(function (buttonYPosition, index) {
        var buttonNumber = index + 1;
        var buttonText = "Collect " + buttonNames[index];

        var button = _this.add.image(-200, buttonYPosition, buttonKey).setOrigin(0.5).setInteractive({
          useHandCursor: true
        }).on("pointerup", function () {
          return increaseScores(buttonNames[index].toLowerCase());
        });

        _this.add.text(-200, buttonYPosition, buttonText, buttonTextStyle).setOrigin(0.5).setInteractive({
          useHandCursor: true
        }).on("pointerup", function () {
          return increaseScores(buttonNames[index].toLowerCase());
        });

        button.config = {
          id: buttonNumber,
          ariaLabel: buttonText
        };
        accessibilify(button);
      }, this);

      var onGameComplete = function onGameComplete() {
        markLevelAsComplete(_this.transientData["level-select"].choice.id);
        _this.transientData.results = {
          keys: keys,
          gems: gems,
          stars: stars
        };

        _this.navigation.next();
      };

      var markLevelAsComplete = function markLevelAsComplete(levelTitle) {
        var stateConfig = _this.context.config.theme["level-select"].choices.map(function (_ref) {
          var id = _ref.id,
              state = _ref.state;
          return {
            id: id,
            state: state
          };
        });

        _this.states = state.create(_this.context.config.theme["level-select"].storageKey, stateConfig);

        _this.states.set(levelTitle, "completed");
      };

      var tweenItem = function tweenItem(target) {
        _this.tweens.add({
          targets: target,
          scale: 1.1,
          delay: 0,
          duration: 50
        });

        _this.tweens.add({
          targets: target,
          scale: 1.0,
          delay: 50,
          duration: 50
        });
      };

      var increaseScores = function increaseScores(item) {
        if (item == "star") {
          stars++;
          starScore.text = stars;
          tweenItem(starImage);

          _this.sound.play("results.coin-sfx");

          _this.calculateAchievements(item, stars, achievementNames[item]);
        }

        if (item == "gem") {
          gems++;
          gemScore.text = gems;
          tweenItem(gemImage);

          _this.sound.play("results.gem-sfx");

          _this.calculateAchievements(item, gems, achievementNames[item]);
        }

        if (item == "key") {
          keys++;
          keyScore.text = keys;
          tweenItem(keyImage);

          _this.sound.play("results.key-sfx");

          _this.calculateAchievements(item, keys, achievementNames[item]);
        }
      };

      this.add.text(0, 200, "Character Selected: ".concat(this.transientData["character-select"].choice.title), {
        font: "32px ReithSans",
        fill: "#f6931e",
        align: "center"
      }).setOrigin(0.5);
      this.add.text(0, 250, "Level Selected: ".concat(this.transientData["level-select"].choice.title), {
        font: "32px ReithSans",
        fill: "#f6931e",
        align: "center"
      }).setOrigin(0.5);
    }
  }]);

  return Game;
}(Screen);