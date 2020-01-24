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
        this.justify();
    }

    justify() {
        const drawArea = this.getDrawArea();
        const lastGameObject = this.list.slice(-1)[0];
        const rowWidth = lastGameObject ? lastGameObject.x + lastGameObject.width : 0;
        if (this.rowConfig.justification === "left") {
            this.list.forEach(gameObject => (gameObject.x += -rowWidth));
            return;
        }
        if (this.rowConfig.justification === "right") {
            return;
        }
        if (this.rowConfig.justification === "marginLeft") {
            this.list.forEach(gameObject => (gameObject.x += drawArea.x));
            return;
        }
        if (this.rowConfig.justification === "marginRight") {
            const lastGameObject = this.list.slice(-1)[0];
            this.list.forEach(gameObject => (gameObject.x -= drawArea.x + lastGameObject.x + lastGameObject.width));
            return;
        }
        this.list.forEach(gameObject => (gameObject.x -= rowWidth / 2));
    }

    updateMarginJustification() {
        const drawArea = this.getDrawArea();
        if (this.rowConfig.justification === "marginLeft") {
            const oldDrawAreaX = this.list[0] ? this.list[0].x : 0;
            this.list.forEach(gameObject => (gameObject.x += drawArea.x - oldDrawAreaX));
        }
        if (this.rowConfig.justification === "marginRight") {
            const lastGameObject = this.list.slice(-1)[0];
            const oldDrawAreaX = -lastGameObject.x - lastGameObject.width;
            this.list.forEach(gameObject => (gameObject.x -= drawArea.x - oldDrawAreaX));
        }
    }

    addSection(gameObject) {
        const lastGameObject = this.list.slice(-1)[0];
        gameObject.x = lastGameObject ? lastGameObject.x + lastGameObject.width : 0;
        gameObject.y -= gameObject.height / 2;
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
    }

    reset() {
        this.setContainerPosition();
        this.updateMarginJustification();
    }

    makeAccessible() {}
}
