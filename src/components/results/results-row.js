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
        this.align();
    }

    align() {
        const drawArea = this.getDrawArea();
        const lastGameObject = this.list.slice(-1)[0];
        const rowWidth = lastGameObject ? lastGameObject.x + lastGameObject.width : 0;
        if (this.rowConfig.align === "left") {
            this.list.forEach(gameObject => (gameObject.x += -rowWidth + gameObject.getData("offsetX")));
            return;
        }
        if (this.rowConfig.align === "right") {
            return;
        }
        if (this.rowConfig.align === "marginLeft") {
            this.list.forEach(gameObject => (gameObject.x += drawArea.x));
            return;
        }
        if (this.rowConfig.align === "marginRight") {
            const lastGameObject = this.list.slice(-1)[0];
            this.list.forEach(gameObject => (gameObject.x -= drawArea.x + lastGameObject.x + lastGameObject.width));
            return;
        }
        this.list.forEach(gameObject => (gameObject.x -= rowWidth / 2));
    }

    updateMarginAlignment() {
        const drawArea = this.getDrawArea();
        if (this.rowConfig.align === "marginLeft") {
            const oldDrawAreaX = this.list[0].x;
            this.list.forEach(
                gameObject => (gameObject.x += drawArea.x - oldDrawAreaX + gameObject.getData("offsetX")),
            );
        }
        if (this.rowConfig.align === "marginRight") {
            const lastGameObject = this.list.slice(-1)[0];
            const oldDrawAreaX = -lastGameObject.x - lastGameObject.width;
            this.list.forEach(
                gameObject => (gameObject.x -= drawArea.x - oldDrawAreaX + gameObject.getData("offsetX")),
            );
        }
    }

    addSection(gameObject, offsetX = 0, offsetY = 0) {
        const lastGameObject = this.list.slice(-1)[0];
        gameObject.x = lastGameObject ? lastGameObject.x + lastGameObject.width : 0;
        gameObject.y -= gameObject.height / 2;
        gameObject.x += offsetX;
        gameObject.y += offsetY;
        gameObject.setData({ offsetX, offsetY });
        this.add(gameObject);
    }

    drawRow() {
        this.rowConfig.format &&
            this.rowConfig.format.forEach(object => {
                if (object.type === "text") {
                    this.addSection(new ResultsText(this.scene, object), object.offsetX, object.offsetY);
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
        this.updateMarginAlignment();
    }

    makeAccessible() {}
}
