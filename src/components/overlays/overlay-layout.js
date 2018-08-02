/**
 * Overlay Layout
 * @module components/overlays/overlay-layout
 */

import fp from "../../../lib/lodash/fp/fp.js";

/**
 * Provides some shared behaviour common to all overlay screens such as:
 * - Adding a background
 * - Moving GEL buttons to the top
 */

export function create(screen) {
    const backgroundPriorityID = 999;
    const priorityID = backgroundPriorityID + screen.context.popupScreens.length;
    return {
        addBackground,
        moveGelButtonsToTop,
        moveToTop,
    };

    function addBackground(backgroundImage) {
        backgroundImage.inputEnabled = true;
        backgroundImage.input.priorityID = priorityID - 1;
        return screen.scene.addToBackground(backgroundImage);
    }

    function moveGelButtonsToTop(gelLayout) {
        fp.forOwn(button => {
            button.input.priorityID = priorityID;
            button.parent.updateTransform();
            button.parent.parent.updateTransform();
            button.update();
        }, gelLayout.buttons);
    }

    function moveToTop(item) {
        item.inputEnabled = true;
        item.input.priorityID = priorityID;
    }
}
