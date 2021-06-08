/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import crel from "../../../lib/crel.es.js";
import { getContainerDiv } from "../loader/container.js";
var domButtons = [];
var domGroups = [];
var root = crel("div", {
  id: "accessibility",
  role: "application"
});

var hasAccessibleElement = function hasAccessibleElement(button) {
  return Boolean(fp.get("accessibleElement.el.id", button));
};

var removeFromParent = function removeFromParent(el) {
  return el.parentElement && el.parentElement.removeChild(el);
};

var clear = function clear() {
  var children = Array.from(root.childNodes);
  var groups = children.filter(function (child) {
    return child.dataset.type === "group";
  });
  var rootButtons = children.filter(function (child) {
    return child.dataset.type !== "group";
  });
  var buttons = groups.reduce(function (acc, group) {
    return acc.concat(Array.from(group.childNodes));
  }, []).concat(rootButtons);
  buttons.map(removeFromParent);
  groups.map(removeFromParent);
};

var clearButtons = function clearButtons() {
  domButtons = [];
  domGroups = [];
};

var getParent = function getParent(sceneGroups, buttonGroup) {
  var group = sceneGroups.find(function (group) {
    return group.id === buttonGroup;
  });
  return group ? group.el : root;
};

var addButtonToLayer = function addButtonToLayer(button) {
  var parent = getParent(domGroups, button.config.group);
  parent.appendChild(button.accessibleElement.el);
};

var addGroupToLayer = function addGroupToLayer(group) {
  return root.appendChild(group.el);
};

var createDom = function createDom() {
  domGroups.forEach(addGroupToLayer);
  domButtons.filter(hasAccessibleElement).forEach(addButtonToLayer);
};

export var addGroupAt = function addGroupAt(id, pos) {
  pos = pos || domGroups.length;
  var el = crel("div", {
    id: "accessible-group-" + id,
    "data-type": "group"
  });
  domGroups.splice(pos, 0, {
    el: el,
    id: id
  });
};
export var create = function create() {
  return getContainerDiv().appendChild(root);
};
export var addButton = function addButton(button) {
  return domButtons.push(button);
};
export var removeButton = function removeButton(buttonToRemove) {
  return domButtons = domButtons.filter(function (button) {
    return button !== buttonToRemove;
  });
};
export var destroy = fp.flow([clear, clearButtons]);
export var reset = fp.flow([clear, createDom]);