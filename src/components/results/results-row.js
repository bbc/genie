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
        this.setContainerPosition();
    }

    drawRow() {
        this.addAt(
            new Phaser.GameObjects.Text(this.scene, 0, 0, "Placeholder Text", this.rowConfig.textStyle).setOrigin(
                0.5,
                0.5,
            ),
        );
    }

    getBoundingRect() {
        return this.getDrawArea();
    }

    setContainerPosition() {
        const { centerX, centerY } = this.getDrawArea();
        this.x = centerX;
        this.y = centerY;
    }

    reset() {
        this.setContainerPosition();
    }

    makeAccessible() {}
}
