export function drawSomething(game: Phaser.Game, layout: any) {
    const tempLayout = layout.create(["exit", "howToPlay", "play", "settings"]);

    const style = { font: "65px Arial", fill: "#FFCC66", align: "center" };
    let drawnObject;
    const bitmapData = game.add.bitmapData(1400, 600);

    bitmapData.ctx.beginPath();
    bitmapData.ctx.rect(0, 0, 1400, 600);
    bitmapData.ctx.fillStyle = "#ffffff";
    bitmapData.ctx.fill();
    drawnObject = game.add.sprite(game.world.centerX, game.world.centerY, bitmapData);
    drawnObject.anchor.setTo(0, 0);

    const text = game.add.text(550, 2000, "- Phaser -\nloading in the GMI", style);
    text.anchor.set(0.5, 0.5);
    drawnObject.anchor.set(0.5, 0.5);
    // gelLayers.addToBackground(drawnObject);
    // gelLayers.addToBackground(text);
}
