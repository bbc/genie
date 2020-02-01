/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export const removeFromParent = el => el.parentElement && el.parentElement.removeChild(el);

export const showElement = el => {
    el.setAttribute("aria-label", releaseAccessibilityLabel(el));
    el.classList.remove("hide-focus-ring");
    el.style.cursor = "pointer";
    el.style["z-index"] = 0;
    el.setAttribute("tabindex", "0");
    el.addEventListener("click", el.button.elementEvents.click);
    el.addEventListener("keyup", el.button.elementEvents.keyup);
};

export const hideElement = el => {
    preserveAccessibilityLabel(el);
    el.setAttribute("aria-label", "");
    el.classList.add("hide-focus-ring");
    el.style.cursor = "default";
    el.style["z-index"] = -1;
    el.setAttribute("tabindex", "-1");
    el.removeEventListener("click", el.button.elementEvents.click);
    el.removeEventListener("keyup", el.button.elementEvents.keyup);
};

export const hideAndDisableElement = el => {
    if (!elementHiddenAndDisabled(el)) {
        hideElement(el);
        const resetElement = () => resetElementToDefault(el, resetElement);
        el.addEventListener("blur", resetElement);
        setElementAsHiddenAndDisabled(el);
    }
};

//eslint-disable-next-line local-rules/disallow-timers
const callOnNextTick = fn => setTimeout(fn, 0);

const resetElementToDefault = (el, self) => {
    el.removeEventListener("blur", self);
    callOnNextTick(() => {
        el.parentElement && el.parentElement.removeChild(el);
        showElement(el);
        unsetElementAsHiddenAndDisabled(el);
    });
};

const elementHiddenAndDisabled = element => _elementHiddenAndDisabled[element.id];

const setElementAsHiddenAndDisabled = element => (_elementHiddenAndDisabled[element.id] = true);

const unsetElementAsHiddenAndDisabled = element => (_elementHiddenAndDisabled[element.id] = false);

const preserveAccessibilityLabel = element => (_elementAriaLabel[element.id] = element.getAttribute("aria-label"));

const releaseAccessibilityLabel = element => {
    var label = _elementAriaLabel[element.id];
    _elementAriaLabel[element.id] = undefined;
    return label;
};

const _elementHiddenAndDisabled = {};
const _elementAriaLabel = {};
