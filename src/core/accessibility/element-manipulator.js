import { findButtonByElementId } from "./accessible-buttons.js";

export const hideAndDisableElement = el => {
    if (!_elementHiddenAndDisabled[el.id]) {
        const button = findButtonByElementId(el.id);
        const resetElement = () => resetElementToDefault(el, button, resetElement);
        el.addEventListener("blur", resetElement);
        el.classList.add("hide-focus-ring");
        el.style.cursor = "default";
        el.removeEventListener("click", button.elementEvents.click);
        el.removeEventListener("keyup", button.elementEvents.keyup);
        setElementAsHiddenAndDisabled(el);
    }
};

const resetElementToDefault = (el, button, self) => {
    el.parentElement.removeChild(el);
    el.removeEventListener("blur", self);
    el.classList.remove("hide-focus-ring");
    el.style.cursor = "pointer";
    el.addEventListener("click", button.elementEvents.click);
    el.addEventListener("keyup", button.elementEvents.keyup);
    unsetElementAsHiddenAndDisabled(el);
};

const setElementAsHiddenAndDisabled = element => {
    _elementHiddenAndDisabled[element.id] = true;
};

const unsetElementAsHiddenAndDisabled = element => {
    _elementHiddenAndDisabled[element.id] = false;
};

const _elementHiddenAndDisabled = {};
