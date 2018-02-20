export function accessibilify(button: Phaser.Button | Phaser.Sprite, layoutFactory: LayoutFactory, _ariaLabel?: string) {
    const gameSize = layoutFactory.getSize();
    const overlay = document.getElementById("local-game-holder") as HTMLDivElement;

    overlay.appendChild(element());

    function element(): HTMLDivElement {
        const div = document.createElement("div");
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

        return div;
    }

    function keyUp(event: KeyboardEvent): void {
        const enterKey = (event.key === "Enter");
        const spaceKey = (event.key === " ");

        if (enterKey || spaceKey) {
            callButtonAction();
        }
    }

    function callButtonAction(): void {
        button.events.onInputUp.dispatch(button, button.game.input.activePointer, false);
    }

    function ariaLabel() {
        return _ariaLabel ? _ariaLabel : button.name;
    }

    function cssWidth(): string {
        return (button.width * gameSize.scale).toString() + "px";
    }

    function cssHeight(): string {
        return (button.height * gameSize.scale).toString() + "px";
    }

    function cssLeft(): string {
        return (halfGameWidth() + buttonX()).toString() + "px";
    }

    function cssTop(): string {
        return (halfGameHeight() + buttonY()).toString() + "px";
    }

    function buttonX(): number {
        return button.x * gameSize.scale - halfButtonWidth();
    }

    function buttonY(): number {
        return button.y * gameSize.scale - halfButtonHeight();
    }

    function halfButtonWidth(): number {
        return button.width * 0.5 * gameSize.scale;
    }

    function halfButtonHeight(): number {
        return button.height * 0.5 * gameSize.scale;
    }

    function halfGameWidth(): number {
        return gameSize.width * 0.5;
    }

    function halfGameHeight(): number {
        return gameSize.height * 0.5;
    }
}
