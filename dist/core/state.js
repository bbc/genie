/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "./gmi/gmi.js";
import fp from "../../lib/lodash/fp/fp.js";

var getGenieStore = function getGenieStore() {
  return gmi.getAllSettings().gameData.genie || {};
};

export var states = new Map();
export var create = function create(stateKey, config) {
  if (window.__debug) {
    window.__debug.states = states;
  }

  var getMerged = function getMerged(stored) {
    return config.map(function (item) {
      return Object.assign(item, stored[item.id]);
    });
  };

  var get = function get(key) {
    return Object.assign({}, config.find(function (conf) {
      return conf.id === key;
    }), fp.get("".concat(stateKey, ".").concat(key), getGenieStore()));
  };

  var getStored = function getStored() {
    return getGenieStore()[stateKey] || {};
  };

  var getAll = fp.flow(getStored, getMerged);

  var set = function set(id, state) {
    gmi.setGameData("genie", fp.set([stateKey, id], {
      state: state
    }, getGenieStore()));
  };

  var state = {
    config: config,
    get: get,
    getAll: getAll,
    set: set
  };
  states.set(stateKey, state);
  return state;
};