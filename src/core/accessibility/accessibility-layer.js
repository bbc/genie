let _accessibleButtons = {};

const hasAccessibleElement = button => {
    return !!(button.accessibleElement && button.accessibleElement.id);
};

const PARENT_ELEMENT_ID = "accessibility";

const getAccessibleButtons = visibleLayer => {
    return _accessibleButtons[visibleLayer];
};

export const setup = gameParentElement => {
    const el = document.createElement("div");
    el.id = PARENT_ELEMENT_ID;
    gameParentElement.appendChild(el);
};

export const addToAccessibleButtons = (screen, button) => {
    const visibleLayer = screen.visibleLayer;

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

export const clearElementsFromDom = () => {
    const parentElement = document.getElementById(PARENT_ELEMENT_ID);
    parentElement.innerHTML = "";

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
