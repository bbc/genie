let _accessibleButtons = {};

const hasAccessibleElement = button => {
    return !!(button.accessibleElement && button.accessibleElement.id);
};

export const PARENT_ELEMENT_ID = "accessibility";

export const setup = gameParentElement => {
    const el = document.createElement("div");
    el.id = PARENT_ELEMENT_ID;
    gameParentElement.appendChild(el);

    return el;
};

export const getAccessibleButtons = screen => {
    if (screen) {
        return _accessibleButtons[screen];
    } else {
        return _accessibleButtons;
    }
};

export const addToAccessibleButtons = (screen, button) => {
    if (_accessibleButtons[screen]) {
        _accessibleButtons[screen].push(button);
    } else {
        _accessibleButtons[screen] = [button];
    }

    return _accessibleButtons;
};

export const clearAccessibleButtons = () => {
    _accessibleButtons = {};

    return _accessibleButtons;
};

export const clearElementsFromDom = parentElement => {
    parentElement.innerHTML = "";

    return parentElement;
};

export const appendElementsToDom = (buttons, parentElement) => {
    buttons.forEach(button => {
        if (hasAccessibleElement(button)) {
            parentElement.appendChild(button.accessibleElement);
        }
    });
};

export const resetElementsInDom = (screen, parentElement) => {
    const buttons = getAccessibleButtons(screen);
    clearElementsFromDom(parentElement);

    if (buttons) {
        appendElementsToDom(buttons, parentElement);
    }

    return parentElement;
};
