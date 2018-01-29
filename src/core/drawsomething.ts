import { GelLayers } from "src/core/gelLayers";
import { Context } from "src/core/startup";

export function drawSomething(game: Phaser.Game, context: Context) {

    const gelLayers: GelLayers = context.gelLayers;

    const style = { font: "65px Arial", fill: "#00ff00", align: "center" };
    let drawnObject;
    const bitmapData = game.add.bitmapData(1400, 600);

    bitmapData.ctx.beginPath();
    bitmapData.ctx.rect(0, 0, 1400, 600);
    bitmapData.ctx.fillStyle = "#ffffff";
    bitmapData.ctx.fill();
    drawnObject = game.add.sprite(game.world.centerX, game.world.centerY, bitmapData);
    drawnObject.anchor.setTo(game.world.centerX, game.world.centerY);
    const text = game.add.text(0, 0, "- Phaser -\nloading in the GMI", style);
    text.anchor.set(0.5, 0.5);
    drawnObject.anchor.set(0.5, 0.5);
    gelLayers.addToBackground(drawnObject);
    gelLayers.addToBackground(text);
}