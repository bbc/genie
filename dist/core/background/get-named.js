/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";

var isParticleManager = function isParticleManager(found, child) {
  return Boolean(child.emitters);
};

var matchesName = function matchesName(name) {
  return function (found, child) {
    return child.name === name;
  };
};

var getChild = function getChild(found, child) {
  return child;
};

var getEmitter = function getEmitter(name) {
  return function (found, child) {
    return child.emitters.getByName(name) || found;
  };
};

export var getNamed = function getNamed(name) {
  return fp.cond([[matchesName(name), getChild], [isParticleManager, getEmitter(name)], [fp.stubTrue, function (found) {
    return found;
  }]]);
};