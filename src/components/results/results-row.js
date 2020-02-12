/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";

import { ResultsText } from "./results-text.js";
import { ResultsSprite } from "./results-sprite.js";
import { ResultsCountup } from "./results-countup.js";

export class ResultsRow extends Phaser.GameObjects.Container {
    constructor(scene, rowConfig, getDrawArea) {
        super(scene);
        let rowText = "";
        this.rowConfig = rowConfig;
        this.rowConfig.format.forEach(object => {
            if (object.type === "text") {
                rowText = rowText + this.setTextFromTemplate(object.content, scene.transientData);
            }
            if (object.type === "countup") {
                rowText = rowText + this.setTextFromTemplate(object.endCount, scene.transientData);
            }
        });
        this.config = {};
        this.config.ariaLabel = rowText;
        this.getDrawArea = getDrawArea;
        this.drawRow();
        this.setContainerPosition();
        this.align();
        this.setAlpha(rowConfig.alpha);
        this.createBackdrop();
    }

    setTextFromTemplate(templateString, transientData) {
        const template = fp.template(templateString);
        this.text = template(transientData[this.scene.scene.key]);
        return this.text;
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

    createBackdrop() {
        fp.get("backdrop.key", this.rowConfig) && this.backdropFill();
    }

    backdropFill() {
        const config = this.rowConfig.backdrop;
        const backdrop = this.scene.add.image(config.offsetX || 0, config.offsetY || 0, config.key);
        backdrop.alpha = config.alpha || 1;
        backdrop.height = this.displayHeight;
        this.add(backdrop);
        this.sendToBack(backdrop);
    }

    reset() {
        this.setContainerPosition();
    }

    makeAccessible() {}
}
