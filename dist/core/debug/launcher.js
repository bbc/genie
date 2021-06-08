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
import { Screen } from "../screen.js";
import { eventBus } from "../event-bus.js";
import { buttonsChannel } from "../layout/gel-defaults.js";
import { accessibilify } from "../accessibility/accessibilify.js";
import { gmi } from "../gmi/gmi.js";
import { examples } from "./examples.js";
import { addExampleScreens } from "./debug-screens.js";

var addButton = function addButton(config) {
  var button = config.scene.add.gelButton(config.x, config.y, {
    scene: "gelDebug",
    key: "button",
    id: config.id,
    channel: buttonsChannel(config.scene),
    gameButton: true,
    ariaLabel: config.title
  });
  var text = config.scene.add.text(0, 0, config.title).setOrigin(0.5, 0.5);
  button.overlays.set("text", text);
  accessibilify(button, true);
  eventBus.subscribe({
    channel: buttonsChannel(config.scene),
    name: config.id,
    callback: config.callback
  });
};

var getButtonConfig = function getButtonConfig(launcher) {
  return function (id, idx) {
    return {
      scene: launcher,
      x: -240 + Math.floor(idx / 5) * 240,
      y: -140 + idx % 5 * 80,
      id: id,
      title: examples[id].title,
      callback: function callback() {
        launcher.transientData[id] = examples[id].transientData || {};
        launcher.navigation[id]();
      }
    };
  };
};

var titleStyle = {
  font: "32px ReithSans",
  fill: "#f6931e",
  align: "center"
};
export var Launcher = /*#__PURE__*/function (_Screen) {
  _inherits(Launcher, _Screen);

  var _super = _createSuper(Launcher);

  function Launcher() {
    _classCallCheck(this, Launcher);

    return _super.apply(this, arguments);
  }

  _createClass(Launcher, [{
    key: "preload",
    value: function preload() {
      this.load.setBaseURL(gmi.gameDir);
      this.load.setPath("debug/examples/");
      this.load.pack("example-files");
    }
  }, {
    key: "create",
    value: function create() {
      addExampleScreens(this);
      this.add.image(0, 0, "home.background");
      this.add.text(0, -250, "EXAMPLES", titleStyle).setOrigin(0.5);
      this.setLayout(["home"]);
      Object.keys(examples).map(getButtonConfig(this)).map(addButton);
    }
  }]);

  return Launcher;
}(Screen);