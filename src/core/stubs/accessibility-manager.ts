import * as _ from "lodash";

import { AccessibleButton } from "./accessible-button";

export function create(game: Phaser.Game, gameWrapper: HTMLElement) {
    let accessibilityOverlay: HTMLElement;
    let accessibilityActive = false;
    let accessibleButtons: AccessibleButton[] = [];

    constructor();

    return {
        createButton,
        teardown,
        update,
    };

    function constructor() {
        createAccessibilityOverlay();
        activate();

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("mousemove", handleMousemove);
    }

    function createAccessibilityOverlay() {
        accessibilityOverlay = document.createElement("div");

        accessibilityOverlay.classList.add("game-wrapper__accessibility-overlay");
        accessibilityOverlay.style.position = "absolute";
        accessibilityOverlay.style.top = "0";
        accessibilityOverlay.style.left = "0";

        resize();

        gameWrapper.appendChild(accessibilityOverlay);
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.code === "Tab" || event.code === "Enter") {
            activate();
        }
    }

    function handleMousemove(event: MouseEvent) {
        if (accessibilityActive) {
            deactivate();
        }
    }

    function teardown() {
        accessibilityOverlay.innerHTML = "";
        accessibleButtons = [];
    }

    function resize() {
        const gameWrapperBounds = gameWrapper.getBoundingClientRect();

        accessibilityOverlay.style.width = gameWrapperBounds.width.toString() + "px";
        accessibilityOverlay.style.height = gameWrapperBounds.height.toString() + "px";
    }

    function createButton(
        title: string,
        ariaLabel: string,
        anchorPoints: AnchorPoints,
        tabIndex: number,
        cullAccessible: boolean,
        x: number,
        y: number,
        key: string,
        callback?: () => any,
        callbackContext?: Phaser.State,
    ) {
        const button = new AccessibleButton(
            game,
            title,
            ariaLabel,
            anchorPoints,
            tabIndex,
            cullAccessible,
            x,
            y,
            key,
            callback,
            callbackContext,
        );
        accessibleButtons.push(button);
        accessibilityOverlay.appendChild(button.domElement);

        return button;
    }

    function update() {
        _.forEach(accessibleButtons, (button: AccessibleButton) => {
            button.update();
        });
    }

    function activate() {
        accessibilityActive = true;
        accessibilityOverlay.style.display = "inherit";
    }

    function deactivate() {
        accessibilityActive = false;
        accessibilityOverlay.style.display = "none";
    }
}
