import "src/lib/phaser";

export function accessibilify(button: Phaser.Button | Phaser.Sprite, context: Context) {
    // TODO replace gameContainer string with GMI variable.
    const gameContainer: string = "local-game-holder";
    const overlay = document.getElementById(gameContainer) as HTMLDivElement;
    const div: HTMLDivElement = document.createElement("div");
    const buttonProps: { width: string, height: string, x: string, y: string } = buttonProperties();

    div.style.position = "absolute";
    div.style.left = buttonProps.x + "px";
    div.style.top = buttonProps.y + "px";
    div.style.width = buttonProps.width + "px";
    div.style.height = buttonProps.height + "px";
    overlay.appendChild(div);

    function buttonProperties() {
        const gameSize: { width: number, height: number, scale: number, stageHeightPx: number } = context.layoutFactory.getSize();
        const scale: number = gameSize.scale;
        const halfButtonWidth: number = button.width * 0.5 * scale;
        const halfButtonHeight: number = button.height * 0.5 * scale;
        const halfGameWidth: number = gameSize.width * 0.5;
        const halfGameHeight: number = gameSize.height * 0.5;
        const buttonX = button.x * scale - halfButtonWidth;
        const buttonY = button.y * scale - halfButtonHeight;

        return {
            width: (button.width * scale).toString(),
            height: (button.height * scale).toString(),
            x: (halfGameWidth + buttonX).toString(),
            y: (halfGameHeight + buttonY).toString(),
        };
    }
}
