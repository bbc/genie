import fp from "../../../lib/lodash/fp/fp.js";
import { accessibleDomElement } from "./accessible-dom-element.js";

export function accessibilify(button, config, gameButton = true) {
    config = Object.assign(
        {
            id: button.name,
            ariaLabel: button.name,
        },
        config,
    );

    const game = button.game;
    const accessibleElement = newAccessibleElement();
    const resizeAndRepositionElement = fp.debounce(200, setElementSizeAndPosition);

    if (gameButton) {
        game.accessibleButtons.push(button);
    }

    assignEvents();
    resizeAndRepositionElement();

    button.update = update;
    button.accessibleElement = accessibleElement.el;

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
        const positionScale = game.scale.scaleFactorInversed;
        const sizeScale = Phaser.Point.multiply(button.worldScale, game.scale.scaleFactorInversed);

        let bounds = button.getBounds();
        if (button.hitArea) {
            bounds = button.hitArea.clone();
            bounds.topLeft = button.toGlobal(bounds.topLeft);
        }
        bounds.topLeft = bounds.topLeft.multiply(positionScale.x, positionScale.y);
        bounds.scale(sizeScale.x, sizeScale.y);
        return bounds;
    }

    function setElementSizeAndPosition() {
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
        game.scale.onSizeChange.add(resizeAndRepositionElement);
    }

    function teardown() {
        game.scale.onSizeChange.remove(resizeAndRepositionElement);
        accessibleElement.remove();
    }

    function update() {
        if (!button.input.enabled) {
            if (accessibleElement.visible()) {
                accessibleElement.hide();
            }
            return;
        }

        if (!accessibleElement.visible()) {
            accessibleElement.show();
        }
    }

    function buttonAction() {
        if (game.sound.touchLocked) {
            game.sound.unlock();
        }
        button.events.onInputUp.dispatch(button, game.input.activePointer, false);
    }

    function mouseOver() {
        button.events.onInputOver.dispatch(button, game.input.activePointer, false);
    }

    function mouseOut() {
        button.events.onInputOut.dispatch(button, game.input.activePointer, false);
    }
}
