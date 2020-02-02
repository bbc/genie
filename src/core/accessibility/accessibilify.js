/**
 * @module accessibility/accessibilify
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { onScaleChange, getMetrics } from "../scaler.js";
import { accessibleDomElement } from "./accessible-dom-element.js";
import * as a11y from "./accessibility-layer.js";
import { CAMERA_X, CAMERA_Y } from "../layout/metrics.js";

export function accessibilify(button, gameButton = true) {
    let event;
    const sys = button.scene.sys;
    const scene = button.scene;
    const id = [scene.scene.key, button.config.id].join("__");

    const buttonAction = () => button.emit(Phaser.Input.Events.POINTER_UP, button, sys.input.activePointer, false);
    const mouseOver = () => button.emit(Phaser.Input.Events.POINTER_OVER, button, sys.input.activePointer, false);
    const mouseOut = () => button.emit(Phaser.Input.Events.POINTER_OUT, button, sys.input.activePointer, false);

    const options = {
        id,
        button,
        class: "gel-button",
        "aria-label": button.config.ariaLabel,
        parent: sys.scale.parent,
        onClick: buttonAction,
        onMouseOver: mouseOver,
        onMouseOut: mouseOut,
    };

    const getHitAreaBounds = () => {
        const marginLeft = parseInt(sys.game.canvas.style.marginLeft, 10);
        const marginTop = parseInt(sys.game.canvas.style.marginTop, 10);
        let bounds = button.getHitAreaBounds ? button.getHitAreaBounds() : button.getBounds();
        const metrics = getMetrics();

        return {
            x: (bounds.x + CAMERA_X) * metrics.scale + marginLeft,
            y: (bounds.y + CAMERA_Y) * metrics.scale + marginTop,
            width: bounds.width * metrics.scale,
            height: bounds.height * metrics.scale,
        };
    };

    const assignEvents = () => {
        const _destroy = button.destroy;
        button.destroy = () => {
            teardown();
            return _destroy.apply(button, arguments);
        };
        event = onScaleChange.add(resizeAndRepositionElement);
    };

    const setElementSizeAndPosition = () => {
        if (button.active) {
            accessibleElement.position(getHitAreaBounds());
        }
    };

    const accessibleElement = accessibleDomElement(options);
    const resizeAndRepositionElement = fp.debounce(200, setElementSizeAndPosition);

    if (!sys.accessibleButtons) {
        sys.accessibleButtons = [];
    }

    if (gameButton) {
        sys.accessibleButtons.push(button);
    }

    assignEvents();
    resizeAndRepositionElement();
    button.accessibleElement = accessibleElement;

    a11y.addButton(scene.scene.key, button);
    a11y.reset(scene.scene.key);

    const teardown = () => event.unsubscribe();

    return button;
}
