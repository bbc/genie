export function drawSomething(game: Phaser.Game) {
    const style = { font: "65px Arial", fill: "#00ff00", align: "center" };
    const text = game.add.text(game.world.centerX, game.world.centerY, "- Phaser -\nloading in the GMI", style);
    text.anchor.set(0.5);
}
