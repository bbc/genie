/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { hideAndDisableElement, removeFromParent } from "./element-manipulator.js";
import crel from "../../../node_modules/crel/crel.es.js";

let domButtons = {};
let domGroups = {};
let root = crel("div", { id: "accessibility", role: "application" });

const hasAccessibleElement = button => Boolean(button.accessibleElement.el && button.accessibleElement.el.id);
const getButtons = key => (domButtons[key] ? domButtons[key] : []);
const getGroups = key => (domGroups[key] ? domGroups[key] : []);

export const addGroupAt = (sceneKey, id, pos) => {
    domGroups[sceneKey] || (domGroups[sceneKey] = []);
    pos = pos || domGroups[sceneKey].length;

    const el = crel("div", { id: "accessible-group-" + id, "data-type": "group" });
    domGroups[sceneKey].splice(pos, 0, { el, id });
};

export const setup = gameParentElement => gameParentElement.appendChild(root);

export const addButton = (sceneKey, button) => {
    domButtons[sceneKey] || (domButtons[sceneKey] = []);
    domButtons[sceneKey].push(button);
};

export const removeButton = (screenKey, buttonToRemove) =>
    (domButtons[screenKey] = domButtons[screenKey].filter(button => button !== buttonToRemove));

export const clearButtons = () => {
    domButtons = {};
    domGroups = {};
};

//TODO - difference between clear and clearButtons is?
export const clear = () => {
    const children = Array.from(root.childNodes);
    const groups = children.filter(child => child.dataset.type === "group");
    const rootButtons = children.filter(child => child.dataset.type !== "group");
    const buttons = groups.reduce((acc, group) => acc.concat(Array.from(group.childNodes)), []).concat(rootButtons);

    buttons.filter(el => document.activeElement === el).map(hideAndDisableElement);
    buttons.filter(el => document.activeElement !== el).map(removeFromParent);
    groups.map(removeFromParent);

    return root;
};

export const appendToDom = sceneKey => {
    const addGroupToLayer = group => root.appendChild(group.el);

    getGroups(sceneKey).forEach(addGroupToLayer);

    const addButtonToLayer = button => {
        const parent = getGroups(sceneKey).find(group => group.id === button.config.group).el || root;
        parent.appendChild(button.accessibleElement.el);
    };

    getButtons(sceneKey)
        .filter(hasAccessibleElement)
        .forEach(addButtonToLayer);
};

export const reset = sceneKey => {
    clear();
    appendToDom(sceneKey);
};
