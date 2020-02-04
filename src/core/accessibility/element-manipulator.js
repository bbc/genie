/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export const removeFromParent = el => el.parentElement && el.parentElement.removeChild(el);

const showElement = accessibleElement => {
    const el = accessibleElement.el;
    el.setAttribute("aria-label", releaseAccessibilityLabel(el));
    el.classList.remove("hide-focus-ring");
    el.style.cursor = "pointer";
    el.style["z-index"] = 0;
    el.setAttribute("tabindex", "0");
    el.addEventListener("click", accessibleElement.events.click);
    el.addEventListener("keyup", accessibleElement.events.keyup);
};

const hideElement = accessibleElement => {
    const el = accessibleElement.el;
    preserveAccessibilityLabel(el);
    el.setAttribute("aria-label", "");
    el.classList.add("hide-focus-ring");
    el.style.cursor = "default";
    el.style["z-index"] = -1;
    el.setAttribute("tabindex", "-1");
    el.removeEventListener("click", accessibleElement.events.click);
    el.removeEventListener("keyup", accessibleElement.events.keyup);
};

export const hideAndDisableElement = accessibleElement => {
    const el = accessibleElement.el;
    if (!elementHiddenAndDisabled(el)) {
        hideElement(accessibleElement);
        const resetElement = () => resetElementToDefault(accessibleElement, resetElement);
        el.addEventListener("blur", resetElement);
        setElementAsHiddenAndDisabled(el);
    }
};

//eslint-disable-next-line local-rules/disallow-timers
const callOnNextTick = fn => setTimeout(fn, 0);

const resetElementToDefault = (accessibleElement, self) => {
    const el = accessibleElement.el;
    el.removeEventListener("blur", self);
    callOnNextTick(() => {
        removeFromParent(el);
        showElement(accessibleElement);
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
