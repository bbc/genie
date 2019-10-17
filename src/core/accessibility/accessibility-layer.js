/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Buttons } from "./accessible-buttons.js";
import { hideAndDisableElement } from "./element-manipulator.js";

let _accessibleButtons = {};

const hasAccessibleElement = button => {
    return !!(button.accessibleElement && button.accessibleElement.id);
};

const PARENT_ELEMENT_ID = "accessibility";

export const getAccessibleButtons = key => _accessibleButtons[key];

export const setup = gameParentElement => {
    const el = document.createElement("div");
    el.id = PARENT_ELEMENT_ID;
    el.setAttribute("role", "application");
    gameParentElement.appendChild(el);
};

export const addToAccessibleButtons = (screen, button) => {
    const visibleScreenKey = screen.scene.key;
    Buttons[button.elementId] = button;

    if (_accessibleButtons[visibleScreenKey]) {
        _accessibleButtons[visibleScreenKey].push(button);
    } else {
        _accessibleButtons[visibleScreenKey] = [button];
    }
};

export const removeFromAccessibleButtons = (screen, button) => {
    const visibleScreenKey = screen.scene.key;

    const idx = _accessibleButtons[visibleScreenKey].indexOf(button);

    if (idx !== -1) {
        _accessibleButtons[visibleScreenKey].splice(idx, 1);
    }
};

export const clearAccessibleButtons = screen => {
    if (screen) {
        _accessibleButtons[screen.scene.key] = [];
    } else {
        _accessibleButtons = {};
    }
};

export const clearElementsFromDom = () => {
    const parentElement = document.getElementById(PARENT_ELEMENT_ID);
    const childNodes = Array.from(parentElement.childNodes);
    childNodes.forEach(el => {
        if (document.activeElement === el) {
            hideAndDisableElement(el);
        } else {
            el.parentElement.removeChild(el);
        }
    });

    return parentElement;
};

export const appendElementsToDom = screen => {
    const buttons = getAccessibleButtons(screen.scene.key);
    const parentElement = document.getElementById(PARENT_ELEMENT_ID);

    buttons.forEach(button => {
        if (hasAccessibleElement(button)) {
            parentElement.appendChild(button.accessibleElement);
        }
    });
};

export const resetElementsInDom = screen => {
    clearElementsFromDom();
    appendElementsToDom(screen);
};
