export function drawSomething(game: Phaser.Game, layout: any) {
    const tempLayout = layout.create(["exit", "howToPlay", "play", "soundOff", "settings"]);

    const style = { font: "65px Arial", fill: "#FFCC66", align: "center" };
    const text = game.add.text(0, -160, "- Phaser -\nloading in the GMI", style);
    layout.addToBackground(text);
    text.anchor.set(0.5, 0.5);
}
