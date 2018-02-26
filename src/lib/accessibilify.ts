import { debounce } from "lodash";

export function accessibilify(button: Phaser.Button | Phaser.Sprite, layoutFactory: LayoutFactory, _ariaLabel?: string) {
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

        return div;
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
