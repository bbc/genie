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
        button.update = checkBounds;
    }

    function teardown() {
        accessibleElement.remove();
        game.scale.onSizeChange.remove(setElementPosition);
    }

    function checkBounds() {
        setElementPosition();
        if (isOutsideScreen() && accessibleElement.visible()) {
            accessibleElement.hide();
        } else if (!isOutsideScreen() && !accessibleElement.visible()) {
            accessibleElement.show();
        }
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
