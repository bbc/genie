/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { hideAndDisableElement, removeFromParent } from "./element-manipulator.js";
import crel from "../../../node_modules/crel/crel.es.js";

let domButtons = {};
let domGroups = {};
let accessibiltyEl = crel("div", { id: "accessibility", role: "application" });

const hasAccessibleElement = button => Boolean(button.accessibleElement && button.accessibleElement.id);
const getAccessibleButtons = key => (domButtons[key] ? domButtons[key] : []);

export const addGroupAt = (sceneKey, name, pos) => {
    domGroups[sceneKey] || (domGroups[sceneKey] = []);
    pos = pos || domGroups[sceneKey].length;
    domGroups[sceneKey].splice(pos, 0, name);
};

export const setup = gameParentElement => gameParentElement.appendChild(accessibiltyEl);

export const addButton = (sceneKey, button) => {
    domButtons[sceneKey] || (domButtons[sceneKey] = []);
    domButtons[sceneKey].push(button);
};

export const removeButton = (screenKey, buttonToRemove) =>
    (domButtons[screenKey] = domButtons[screenKey].filter(button => button !== buttonToRemove));

export const clearButtons = () => {
    domButtons = {};
    tempGroupTracker = {};
    domGroups = {};
};

//TODO - difference between clear and clearButtons is?
export const clear = () => {
    const buttons = Array.from(accessibiltyEl.childNodes);
    //const buttons = domButtons[sceneKey] || [];
    buttons.filter(el => document.activeElement === el).map(hideAndDisableElement);
    buttons.filter(el => document.activeElement !== el).map(removeFromParent);

    return accessibiltyEl;
};

let tempGroupTracker = {};

export const appendToDom = sceneKey => {
    const buttons = getAccessibleButtons(sceneKey);

    Object.keys(tempGroupTracker).forEach(key => {
        const el = tempGroupTracker[key];
        el.parentNode && el.parentNode.removeChild(el);
    });

    //TODO remove this
    tempGroupTracker = {};

    domGroups[sceneKey].forEach(id => {
        const group = crel("div", { id: "accessible-group-" + id });
        accessibiltyEl.appendChild(group);
        tempGroupTracker[id] = group;
    });

    buttons.filter(hasAccessibleElement).forEach(button => {
        const parent = tempGroupTracker[button.config.group] || accessibiltyEl;
        parent.appendChild(button.accessibleElement);
    });
};

export const reset = sceneKey => {
    clear();
    appendToDom(sceneKey);
};
