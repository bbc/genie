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
        this.drawRow();
        this.reset();
    }

    drawRow() {
        const drawArea = this.getDrawArea();
        this.addAt(
            new Phaser.GameObjects.Text(this.scene, drawArea.centerX, drawArea.centerY, "Placeholder Row Text", {
                color: "#000000",
            }).setOrigin(0.5, 0.5),
        );
    }

    getBoundingRect() {
        return this.getDrawArea();
    }

    reset() {
        const drawArea = this.getDrawArea();
        this.iterate(gameObject => {
            gameObject.x = drawArea.centerX;
            gameObject.y = drawArea.centerY;
        });
    }

    makeAccessible() {}
}
