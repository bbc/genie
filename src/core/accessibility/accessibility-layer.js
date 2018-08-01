import { Buttons, findButtonByElementId } from "./buttons.js";

let _accessibleButtons = {};

const hasAccessibleElement = button => {
    return !!(button.accessibleElement && button.accessibleElement.id);
};

const PARENT_ELEMENT_ID = "accessibility";

const getAccessibleButtons = visibleLayer => _accessibleButtons[visibleLayer];

export const setup = gameParentElement => {
    const el = document.createElement("div");
    el.id = PARENT_ELEMENT_ID;
    gameParentElement.appendChild(el);
};

export const addToAccessibleButtons = (screen, button) => {
    const visibleLayer = screen.visibleLayer;
    Buttons[button.elementId] = button;

    if (_accessibleButtons[visibleLayer]) {
        _accessibleButtons[visibleLayer].push(button);
    } else {
        _accessibleButtons[visibleLayer] = [button];
    }
};

export const clearAccessibleButtons = screen => {
    if (screen) {
        _accessibleButtons[screen.visibleLayer] = [];
    } else {
        _accessibleButtons = {};
    }
};

let oldActiveElement;

export const clearElementsFromDom = () => {
    const parentElement = document.getElementById(PARENT_ELEMENT_ID);
    const childNodes = Array.from(parentElement.childNodes);
    childNodes.forEach(el => {
        if (document.activeElement.id === el.id) {
            const button = findButtonByElementId(el.id);
            const onBlur = () => {
                el.remove();
                el.removeEventListener("blur", onBlur);
                el.classList.remove("hide-focus-ring");
                el.addEventListener("click", button.elementEvents.click);
                el.addEventListener("keyup", button.elementEvents.keyup);
            };
            el.addEventListener("blur", onBlur);
            el.classList.add("hide-focus-ring");
            el.removeEventListener("click", button.elementEvents.click);
            el.removeEventListener("keyup", button.elementEvents.keyup);
        } else {
            el.remove();
        }
    });

    return parentElement;
};

export const appendElementsToDom = screen => {
    const buttons = getAccessibleButtons(screen.visibleLayer);
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
