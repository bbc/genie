/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

export class ResultsRow extends Phaser.GameObjects.Container {
    constructor(scene, rowConfig, getDrawArea) {
        super(scene);
        this.rowConfig = rowConfig;
        this.getDrawArea = getDrawArea;

        this.debugDraw();
    }

    debugDraw() {
        this.drawArea = this.getDrawArea();
        this.debugGraphics = this.scene.add.graphics();
        this.debugGraphics.lineStyle(2, 0xff0000, 1);
        this.debugGraphics.strokeRectShape(this.drawArea);
    }

    reset() {
        this.debugGraphics.clear();
        this.debugDraw();
    }
}
