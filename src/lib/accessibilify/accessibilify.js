import debounce from "../../lib/lodash/debounce.js";
import { accessibleDomElement } from "./accessible-dom-element.js";

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
    const repositionElement = debounce(setElementPosition, 200);

    assignEvents();
    repositionElement();

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

    function setElementPosition() {
        accessibleElement.position(button.getBounds());
    }

    function assignEvents() {
        game.scale.onSizeChange.add(repositionElement);
        game.state.onStateChange.addOnce(teardown);
        button.update = checkBounds;
    }

    function teardown() {
        accessibleElement.remove();
        game.scale.onSizeChange.remove(repositionElement);
    }

    function checkBounds() {
        if (isOutsideScreen() && accessibleElement.visible()) {
            accessibleElement.hide();
        } else if (!isOutsideScreen() && !accessibleElement.visible()) {
            accessibleElement.show();
        }
    }

    function isOutsideScreen() {
        const pixiBounds = button.getBounds();
        const buttonBounds = new Phaser.Rectangle(pixiBounds.x, pixiBounds.y, pixiBounds.width, pixiBounds.height);

        return (
            buttonBounds.top > game.height ||
            buttonBounds.bottom < 0 ||
            buttonBounds.left > game.width ||
            buttonBounds.right < 0
        );
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
