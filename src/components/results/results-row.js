/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { ResultsText } from "./results-text.js";
import { ResultsSprite } from "./results-sprite.js";
import { ResultsCountup } from "./results-countup.js";

export class ResultsRow extends Phaser.GameObjects.Container {
    constructor(scene, rowConfig, getDrawArea) {
        super(scene);
        this.rowConfig = rowConfig;
        this.getDrawArea = getDrawArea;
        this.drawRow();
        this.setContainerPosition();
        this.align();
        this.setAlpha(rowConfig.alpha);
    }

    align() {
        const lastGameObject = this.list.slice(-1)[0];
        const rowWidth = lastGameObject ? lastGameObject.x + lastGameObject.width : 0;
        this.list.forEach(gameObject => (gameObject.x -= rowWidth / 2));
    }

    addSection(gameObject, offsetX = 0, offsetY = 0) {
        const lastGameObject = this.list.slice(-1)[0];
        gameObject.x = lastGameObject ? lastGameObject.x + lastGameObject.width : 0;
        gameObject.y -= gameObject.height / 2;
        gameObject.x += offsetX;
        gameObject.y += offsetY;
        this.add(gameObject);
    }

    drawRow() {
        const objectType = {
            text: ResultsText,
            sprite: ResultsSprite,
            countup: ResultsCountup,
        };

        this.rowConfig.format &&
            this.rowConfig.format.forEach(object => {
                this.addSection(new objectType[object.type](this.scene, object), object.offsetX, object.offsetY);
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
    }

    makeAccessible() {}
}
