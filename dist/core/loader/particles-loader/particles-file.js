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
 * Particles File loader plugin.
 *
 * @module components/loader/JSON5File.js
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { geomParse } from "./geom-parse.js";

var parsePhaserGeom = function parsePhaserGeom(zoneConfig) {
  return zoneConfig && zoneConfig.source && (zoneConfig.source = geomParse(zoneConfig.source));
};

export var ParticlesFile = /*#__PURE__*/function (_Phaser$Loader$File) {
  _inherits(ParticlesFile, _Phaser$Loader$File);

  var _super = _createSuper(ParticlesFile);

  function ParticlesFile(loader, fileConfig, xhrSettings, dataKey) {
    var _this;

    _classCallCheck(this, ParticlesFile);

    _this = _super.call(this, loader, Object.assign(fileConfig, {
      type: "particles"
    }));
    var particlesDefaults = {
      cache: loader.cacheManager.json,
      extension: "json",
      responseType: "text",
      xhrSettings: xhrSettings,
      config: dataKey
    };
    Object.assign(fileConfig, particlesDefaults);
    Phaser.Loader.File.call(_assertThisInitialized(_this), loader, fileConfig);
    return _this;
  }
  /**
   * Called automatically by Loader.nextFile.
   * This method controls what extra work this File does with its loaded data.
   *
   * @method Phaser.Loader.FileTypes.JSONFile#onProcess
   * @since 3.7.0
   */


  _createClass(ParticlesFile, [{
    key: "onProcess",
    value: function onProcess() {
      this.data = JSON.parse(this.xhrLoader.responseText);
      parsePhaserGeom(this.data.emitZone);
      parsePhaserGeom(this.data.deathZone);
      this.onProcessComplete();
    }
  }]);

  return ParticlesFile;
}(Phaser.Loader.File);