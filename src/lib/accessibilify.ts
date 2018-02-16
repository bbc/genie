import "src/lib/phaser";

export function accessibilify(button: Phaser.Button | Phaser.Sprite, context: Context) {
    // TODO replace gameContainer string with GMI variable.
    const gameContainer = "local-game-holder";
    const overlay = document.getElementById(gameContainer) as HTMLDivElement;
    const div = document.createElement("div");

    const buttonProps = buttonProperties();
    div.style.position = "absolute";
    div.style.left = buttonProps.x + "px";
    div.style.top = buttonProps.y + "px";
    div.style.width = buttonProps.width + "px";
    div.style.height = buttonProps.height + "px";
    overlay.appendChild(div);

    function buttonProperties() {
        const gameSize = context.layoutFactory.getSize();
        const scale = gameSize.scale;
        const width = button.width * scale;
        const height = button.height * scale;
        const halfButtonWidth = button.width * 0.5 * scale;
        const halfButtonHeight = button.height * 0.5 * scale;
        const x = gameSize.width * 0.5 + button.x * scale - halfButtonWidth;
        const y = gameSize.height * 0.5 + button.y * scale - halfButtonHeight;

        return {
            width: width.toString(),
            height: height.toString(),
            x: x.toString(),
            y: y.toString(),
        };
    }
}
