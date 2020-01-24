/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { ResultsText } from "./results-text.js";

export class ResultsRow extends Phaser.GameObjects.Container {
    constructor(scene, rowConfig, getDrawArea) {
        super(scene);
        this.rowConfig = rowConfig;
        this.getDrawArea = getDrawArea;
        this.drawRow();
        this.setContainerPosition();
    }

    addSection(gameObject) {
        const lastGameObject = this.list.slice(-1)[0];
        gameObject.x = lastGameObject ? lastGameObject.x + lastGameObject.width : 0;
        this.add(gameObject);
    }

    drawRow() {
        this.rowConfig.format &&
            this.rowConfig.format.forEach(object => {
                if (object.type === "text") {
                    this.addSection(new ResultsText(this.scene, object));
                }
            });
    }

    getBoundingRect() {
        return this.getDrawArea();
    }

    setContainerPosition() {
        const { centerX, centerY } = this.getDrawArea();
        this.x = centerX;
        this.y = centerY;
        const lastGameObject = this.list.slice(-1)[0];
        const rowWidth = lastGameObject ? lastGameObject.x + lastGameObject.width : 0;
        if (this.rowConfig.justification === "center") {
            this.list.forEach(gameObject => (gameObject.x += -rowWidth / 2));
        }
        if (this.rowConfig.justification === "left") {
            this.list.forEach(gameObject => (gameObject.x += -rowWidth));
        }
    }

    reset() {
        this.setContainerPosition();
    }

    makeAccessible() {}
}
