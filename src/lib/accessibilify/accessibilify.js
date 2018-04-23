import { accessibleDomElement } from "./accessible-dom-element.js";
import * as signal from "../../core/signal-bus.js";
import fp from "../../lib/lodash/fp/fp.js";

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
    const setElPosition = fp.debounce(200, setElementPosition);

    assignEvents();
    setElPosition();

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
        if (button.alive) {
            const bounds = getHitAreaBounds();
            accessibleElement.position(bounds);
        }
    }

    function assignEvents() {
        const _destroy = button.destroy;
        button.destroy = () => {
            teardown();
            return _destroy.apply(button, arguments);
        };

        game.state.onStateChange.addOnce(teardown);
        button.update = update;
        button.setElPosition = setElPosition;
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
                accessibleElement.hide();
            }
            return;
        }

        if (!accessibleElement.visible()) {
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
