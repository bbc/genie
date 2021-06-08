function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export function parseUrlParams(paramsString) {
  if (!valid(paramsString)) {
    return {};
  }

  var keyValues = paramsString.slice(paramsString.indexOf("?") + 1).split("&");
  return keyValues.reduce(function (params, hash) {
    var _hash$split = hash.split("="),
        _hash$split2 = _slicedToArray(_hash$split, 2),
        key = _hash$split2[0],
        val = _hash$split2[1];

    return Object.assign(params, _defineProperty({}, key, parseBooleans(val)));
  }, {});
}

var parseBooleans = function parseBooleans(val) {
  var decodedComponent = decodeURIComponent(val);

  if (decodedComponent === "true") {
    return true;
  } else if (decodedComponent === "false") {
    return false;
  } else {
    return decodedComponent;
  }
};

var valid = function valid(paramsString) {
  var hasQuestionMark = paramsString.indexOf("?") >= 0;
  var hasEqualsSymbol = paramsString.indexOf("=") >= 0;
  return hasQuestionMark && hasEqualsSymbol;
};