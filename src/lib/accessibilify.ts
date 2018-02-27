import { debounce } from "lodash";

export function accessibilify(button: Phaser.Button | Phaser.Sprite, layoutFactory: LayoutFactory, _ariaLabel?: string) {
    let enabled = true;
    const overlay = button.game.canvas.parentElement as HTMLDivElement;
    const div = document.createElement("div");
    overlay.appendChild(element());

    function element(): HTMLDivElement {
        div.id = button.name;
        div.setAttribute("tabindex", "0");
        div.setAttribute("aria-label", ariaLabel());
        div.style.position = "absolute";
        div.style.left = cssLeft();
        div.style.top = cssTop();
        div.style.width = cssWidth();
        div.style.height = cssHeight();
        div.addEventListener("keyup", keyUp);
        div.addEventListener("click", callButtonAction);
        button.game.scale.onSizeChange.add(debounce(reposition, 200));
        button.update = checkBounds;
        return div;
    }

    function disableButton(): void {
        div.setAttribute("tabindex", "-1");
        enabled = false;
        div.style.visibility = "hidden";
    }

    function enableButton(): void {
        div.setAttribute("tabindex", "0");
        enabled = true;
        div.style.visibility = "visible";
    }

    function checkBounds(): void {
        const pixiBounds = button.getBounds();
        const buttonBounds = new Phaser.Rectangle(pixiBounds.x, pixiBounds.y, pixiBounds.width, pixiBounds.height);

        if (isOutsideScreen(buttonBounds) && enabled) {
            disableButton();
        }
        else if (!isOutsideScreen(buttonBounds) && !enabled) {
            enableButton();
        }
    }

    function isOutsideScreen(buttonBounds: Phaser.Rectangle): boolean {
        return buttonBounds.top > button.game.height ||
        buttonBounds.bottom < 0 ||
        buttonBounds.left > button.game.width ||
        buttonBounds.right < 0;
    }

    function keyUp(event: KeyboardEvent): void {
        const enterKey = event.key === "Enter";
        const spaceKey = event.key === " ";

        if (enterKey || spaceKey) {
            callButtonAction();
        }
    }

    function callButtonAction(): void {
        button.events.onInputUp.dispatch(button, button.game.input.activePointer, false);
    }

    function reposition(): void {
        div.style.left = cssLeft();
        div.style.top = cssTop();
        div.style.width = cssWidth();
        div.style.height = cssHeight();
    }

    function ariaLabel(): string {
        return _ariaLabel ? _ariaLabel : button.name;
    }

    function cssWidth(): string {
        return button.getBounds().width.toString() + "px";
    }

    function cssHeight(): string {
        return button.getBounds().height.toString() + "px";
    }

    function cssLeft(): string {
        return button.getBounds().x.toString() + "px";
    }

    function cssTop(): string {
        return button.getBounds().y.toString() + "px";
    }
}
