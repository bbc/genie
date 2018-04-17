import { accessibleDomElement } from "./accessible-dom-element.js";
import * as signal from "../../core/signal-bus.js";

export function accessibilify(button, config) {
    config = Object.assign(
        {
            id: button.name,
            ariaLabel: button.name,
        },
        config,
    );

    const game = button.game;
    const accessibleElement = newAccessibleElement();

    assignEvents();
    setElementPosition();

    return button;

    function newAccessibleElement() {
        return accessibleDomElement({
            id: config.id,
            ariaLabel: config.ariaLabel,
            parent: game.canvas.parentElement,
            onClick: buttonAction,
            onMouseOver: mouseOver,
            onMouseOut: mouseOut,
        });
    }

    function getHitAreaBounds() {
        const bounds = button.hitArea.clone();
        bounds.topLeft = button.toGlobal(bounds.topLeft);
        return bounds;
    }

    function setElementPosition() {
        const bounds = getHitAreaBounds();
        accessibleElement.position(bounds);
    }

    function assignEvents() {
        game.state.onStateChange.addOnce(teardown);
        button.update = update;
    }

    function teardown() {
        accessibleElement.remove();
    }

    function update() {
        if (!button.input.enabled) {
            if (accessibleElement.visible()) {
                accessibleElement.hide();
            }
            return;
        }

        if (isOutsideScreen()) {
            if (accessibleElement.visible()) {
                return accessibleElement.hide();
            }
        }

        if (!accessibleElement.visible()) {
            accessibleElement.show();
        }
        setElementPosition();
    }

    function isOutsideScreen() {
        const bounds = getHitAreaBounds();
        return bounds.top > game.height || bounds.bottom < 0 || bounds.left > game.width || bounds.right < 0;
    }

    function buttonAction() {
        button.events.onInputUp.dispatch(button, game.input.activePointer, false);
    }

    function mouseOver() {
        button.events.onInputOver.dispatch(button, game.input.activePointer, false);
    }

    function mouseOut() {
        button.events.onInputOut.dispatch(button, game.input.activePointer, false);
    }
}
