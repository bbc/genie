/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { hideAndDisableElement, removeFromParent } from "./element-manipulator.js";
import fp from "../../../lib/lodash/fp/fp.js";
import crel from "../../../lib/crel.es.js";

let domButtons = [];
let domGroups = [];
let root = crel("div", { id: "accessibility", role: "application" });

const hasAccessibleElement = button => Boolean(fp.get("accessibleElement.el.id", button));
const buttonInDomElements = domEl => button => button.accessibleElement.el.id === domEl.id;

const getElFromDom = domEl => {
    const domButton = domButtons.filter(hasAccessibleElement).find(buttonInDomElements(domEl));
    return fp.get("accessibleElement", domButton);
};

const isDefined = value => Boolean(value);
const isActiveElement = el => document.activeElement === el;
const isNotActiveElement = el => document.activeElement !== el;

const clear = () => {
    const children = Array.from(root.childNodes);
    const groups = children.filter(child => child.dataset.type === "group");
    const rootButtons = children.filter(child => child.dataset.type !== "group");
    const buttons = groups.reduce((acc, group) => acc.concat(Array.from(group.childNodes)), []).concat(rootButtons);

    buttons
        .filter(isActiveElement)
        .map(getElFromDom)
        .filter(isDefined)
        .map(hideAndDisableElement);

    buttons.filter(isNotActiveElement).map(removeFromParent);
    groups.map(removeFromParent);
};

const clearButtons = () => {
    domButtons = [];
    domGroups = [];
};

const getParent = (sceneGroups, buttonGroup) => {
    const group = sceneGroups.find(group => group.id === buttonGroup);
    return group ? group.el : root;
};

const addButtonToLayer = button => {
    const parent = getParent(domGroups, button.config.group);
    parent.appendChild(button.accessibleElement.el);
};

const addGroupToLayer = group => root.appendChild(group.el);

const createDom = () => {
    domGroups.forEach(addGroupToLayer);
    domButtons.filter(hasAccessibleElement).forEach(addButtonToLayer);
};

export const addGroupAt = (id, pos) => {
    pos = pos || domGroups.length;

    const el = crel("div", { id: "accessible-group-" + id, "data-type": "group" });
    domGroups.splice(pos, 0, { el, id });
};

export const create = gameParentElement => gameParentElement.appendChild(root);
export const addButton = button => domButtons.push(button);
export const removeButton = buttonToRemove => (domButtons = domButtons.filter(button => button !== buttonToRemove));
export const destroy = fp.flow([clear, clearButtons]);
export const reset = fp.flow([clear, createDom]);
