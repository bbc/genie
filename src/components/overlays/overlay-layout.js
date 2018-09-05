/**
 * Overlay Layout
 * @module components/overlays/overlay-layout
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import fp from "../../../lib/lodash/fp/fp.js";

/**
 * Provides some shared behaviour common to all overlay screens such as:
 * - Adding a background
 * - Moving GEL buttons to the top
 */
export function create(screen) {
    const priorityID = 999 + 2 * screen.context.popupScreens.length; //* 2 to provide space between layers for background
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
