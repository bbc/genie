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
 * FontFile is a file type for loading fonts using the Phaser.Loader
 *
 * @module components/loader/font-loader/font-file
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
var FontFile = /*#__PURE__*/function (_Phaser$Loader$File) {
  _inherits(FontFile, _Phaser$Loader$File);

  var _super = _createSuper(FontFile);

  function FontFile(loader, fileConfig) {
    _classCallCheck(this, FontFile);

    return _super.call(this, loader, Object.assign(fileConfig, {
      type: "webfont"
    }));
  }

  _createClass(FontFile, [{
    key: "load",
    value: function load() {
      WebFont.load(_objectSpread(_objectSpread({}, this.config), {}, {
        active: this.onLoad.bind(this),
        inactive: this.onError.bind(this),
        fontactive: this.onFontActive.bind(this),
        fontinactive: this.onFontInactive.bind(this)
      }));
    }
  }, {
    key: "onLoad",
    value: function onLoad() {
      this.loader.nextFile(this, true);
    }
  }, {
    key: "onError",
    value: function onError() {
      this.loader.nextFile(this, false);
    }
  }, {
    key: "onFontActive",
    value: function onFontActive(fontFamily, fontVariationDescription) {
      this.loader.emit("fontactive", this, {
        fontFamily: fontFamily,
        fontVariationDescription: fontVariationDescription
      });
    }
  }, {
    key: "onFontInactive",
    value: function onFontInactive(fontFamily, fontVariationDescription) {
      this.loader.emit("fontinactive", this, {
        fontFamily: fontFamily,
        fontVariationDescription: fontVariationDescription
      });
    }
  }]);

  return FontFile;
}(Phaser.Loader.File);

export default FontFile;