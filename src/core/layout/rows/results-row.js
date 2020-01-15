/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

export class ResultsRow extends Phaser.GameObjects.Container {
    constructor(scene, rowConfig, drawArea) {
        super(scene);
        this._buttons = [];
        this.rowConfig = rowConfig;
        this.drawArea = drawArea;
        this.debugDraw();
        console.log(this.drawArea, this.debugGraphics);
    }

    debugDraw() {
        this.debugGraphics = this.scene.add.graphics();
        this.debugGraphics.lineStyle(2, 0xff0000, 1);
        this.debugGraphics.strokeRectShape(this.drawArea);
    }

    reset() {
        this.debugGraphics.clear();
        this.debugDraw();
    }
}
