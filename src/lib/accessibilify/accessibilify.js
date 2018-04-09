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

    function setElementPosition() {
        const bounds = button.getBounds();
        accessibleElement.position(button.hitArea.clone().centerOn(bounds.centerX, bounds.centerY));
    }

    function assignEvents() {
        game.scale.onSizeChange.add(setElementPosition);
        game.state.onStateChange.addOnce(teardown);
        button.update = checkBounds;
    }

    function teardown() {
        accessibleElement.remove();
        game.scale.onSizeChange.remove(setElementPosition);
    }

    function checkBounds() {
        if (isOutsideScreen() && accessibleElement.visible()) {
            accessibleElement.hide();
        } else if (!isOutsideScreen() && !accessibleElement.visible()) {
            accessibleElement.show();
        }
    }

    function isOutsideScreen() {
        const btnBounds = button.getBounds();
        const hitBounds = button.hitArea.clone().centerOn(btnBounds.centerX, btnBounds.centerY);

        return (
            hitBounds.top > game.height || hitBounds.bottom < 0 || hitBounds.left > game.width || hitBounds.right < 0
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
