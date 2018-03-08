import { debounce } from "lodash";
import { accessibleDomElement } from "./accessible-dom-element";

export function accessibilify(button: Phaser.Button | Phaser.Sprite, ariaLabel?: string): Phaser.Button | Phaser.Sprite {
    const game = button.game;
    const accessibleElement = newAccessibleElement();
    const repositionElement = debounce(setElementPosition, 200);

    assignEvents();
    repositionElement();

    return button;

    function newAccessibleElement(): AccessibleDomElement {
        return accessibleDomElement({
            id: button.name,
            ariaLabel: ariaLabel ? ariaLabel : button.name,
            parent: game.canvas.parentElement as HTMLDivElement,
            onClick: buttonAction,
        });
    }

    function setElementPosition(): void {
        accessibleElement.position(button.getBounds());
    }

    function assignEvents(): void {
        game.scale.onSizeChange.add(repositionElement);
        game.state.onStateChange.addOnce(teardown);
        button.update = checkBounds;
    }

    function teardown(): void {
        accessibleElement.remove();
        game.scale.onSizeChange.remove(repositionElement);
    }

    function checkBounds(): void {
        if (isOutsideScreen() && accessibleElement.visible()) {
            accessibleElement.hide();
        } else if (!isOutsideScreen() && !accessibleElement.visible()) {
            accessibleElement.show();
        }
    }

    function isOutsideScreen(): boolean {
        const pixiBounds = button.getBounds();
        const buttonBounds = new Phaser.Rectangle(pixiBounds.x, pixiBounds.y, pixiBounds.width, pixiBounds.height);

        return (
            buttonBounds.top > game.height ||
            buttonBounds.bottom < 0 ||
            buttonBounds.left > game.width ||
            buttonBounds.right < 0
        );
    }

    function buttonAction(): void {
        button.events.onInputUp.dispatch(button, game.input.activePointer, false);
    }
}
