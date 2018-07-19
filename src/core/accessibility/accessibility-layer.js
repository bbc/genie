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

export const getAccessibleButtons = visibleLayer => {
    if (visibleLayer) {
        return _accessibleButtons[visibleLayer];
    } else {
        return _accessibleButtons;
    }
};

export const addToAccessibleButtons = (visibleLayer, button) => {
    if (_accessibleButtons[visibleLayer]) {
        _accessibleButtons[visibleLayer].push(button);
    } else {
        _accessibleButtons[visibleLayer] = [button];
    }

    return _accessibleButtons;
};

export const clearAccessibleButtons = visibleLayer => {
    if (visibleLayer) {
        _accessibleButtons[visibleLayer] = [];
    } else {
        _accessibleButtons = {};
    }

    return _accessibleButtons;
};

export const clearElementsFromDom = () => {
    const parentElement = document.getElementById(PARENT_ELEMENT_ID);
    parentElement.innerHTML = "";

    return parentElement;
};

export const appendElementsToDom = (screen, buttons) => {
    const btns = buttons || getAccessibleButtons(screen.visibleLayer);
    const parentElement = document.getElementById(PARENT_ELEMENT_ID);

    btns.forEach(button => {
        if (hasAccessibleElement(button)) {
            parentElement.appendChild(button.accessibleElement);
        }
    });
};

export const resetElementsInDom = screen => {
    const visibleLayer = screen.visibleLayer;
    const buttons = getAccessibleButtons(visibleLayer);
    const parentElement = document.getElementById(PARENT_ELEMENT_ID);

    clearAccessibleButtons(visibleLayer);
    clearElementsFromDom(parentElement);

    if (buttons) {
        appendElementsToDom(visibleLayer, buttons);
    }

    return parentElement;
};
