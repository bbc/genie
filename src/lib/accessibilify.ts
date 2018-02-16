import "src/lib/phaser";

export function accessibilify(button: Phaser.Button | Phaser.Sprite, context: Context, action: () => void) {
    const gameSize = context.layoutFactory.getSize();
    const scale = gameSize.scale;
    const overlay = document.getElementById(context.gmi.gameContainerId) as HTMLDivElement;

    overlay.appendChild(element());

    function element(): HTMLDivElement {
        const div = document.createElement("div");
        div.setAttribute("tabindex", "0");
        div.setAttribute("aria-label", button.name);
        div.style.position = "absolute";
        div.style.left = cssLeft();
        div.style.top = cssTop();
        div.style.width = cssWidth();
        div.style.height = cssHeight();
        div.addEventListener("keyup", keyUp);

        return div;
    }

    function keyUp(event: KeyboardEvent): void {
        const enterKey = (event.keyCode === 13);

        if (enterKey) {
            enterKeyPressed();
        }
    }

    function enterKeyPressed(): void {
        action();
    }

    function cssWidth(): string {
        return (button.width * scale).toString() + "px";
    }

    function cssHeight(): string {
        return (button.height * scale).toString() + "px";
    }

    function cssLeft(): string {
        return (halfGameWidth() + buttonX()).toString() + "px";
    }

    function cssTop(): string {
        return (halfGameHeight() + buttonY()).toString() + "px";
    }

    function buttonX(): number {
        return button.x * scale - halfButtonWidth();
    }

    function buttonY(): number {
        return button.y * scale - halfButtonHeight();
    }

    function halfButtonWidth(): number {
        return button.width * 0.5 * scale;
    }

    function halfButtonHeight(): number {
        return button.height * 0.5 * scale;
    }

    function halfGameWidth(): number {
        return gameSize.width * 0.5;
    }

    function halfGameHeight(): number {
        return gameSize.height * 0.5;
    }
}
