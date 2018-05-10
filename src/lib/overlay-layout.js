import fp from "./lodash/fp/fp.js";

export const create = screen => {
    const backgroundPriorityID = 999;
    const priorityID = backgroundPriorityID + screen.context.popupScreens.length;
    const previousLayouts = screen.layoutFactory.getLayouts();
    let disabledButtons = [];

    return {
        addBackground,
        disableExistingButtons,
        restoreDisabledButtons,
        moveGelButtonsToTop,
    };

    function addBackground(backgroundImage) {
        backgroundImage.inputEnabled = true;
        backgroundImage.input.priorityID = priorityID - 1;
        return screen.layoutFactory.addToBackground(backgroundImage);
    }

    function disableExistingButtons() {
        fp.forOwn(layout => {
            fp.forOwn(button => {
                if (button.input.enabled) {
                    button.input.enabled = false;
                    disabledButtons.push(button);
                    button.update();
                }
            }, layout.buttons);
        }, previousLayouts);
    }

    function restoreDisabledButtons() {
        fp.forOwn(button => {
            button.input.enabled = true;
            button.update();
        }, disabledButtons);
    }

    function moveGelButtonsToTop(gelLayout) {
        fp.forOwn(button => {
            button.input.priorityID = priorityID;
            button.parent.updateTransform();
            button.parent.parent.updateTransform();
            button.update();
        }, gelLayout.buttons);
    }
};
