/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import fp from "../../../lib/lodash/fp/fp.js";

export class ResultsCountup extends Phaser.GameObjects.Text {
    constructor(scene, countupConfig) {
        super(scene, 0, 0, undefined, countupConfig.textStyle);
        this.countupConfig = countupConfig;
        this.startCount = this.textFromTemplate(countupConfig.startCount, scene.transientData);
        this.endCount = this.textFromTemplate(countupConfig.endCount, scene.transientData);
        this.text = this.startCount;
        this.setFixedSize(this.getFinalWidth(this.endCount), 0);
    }

    getFinalWidth(finalText) {
        const text = this.text;
        this.text = finalText;
        const width = this.width;
        this.text = text;
        return width;
    }

    textFromTemplate(templateString, transientData) {
        const template = fp.template(templateString);
        return template(transientData[this.scene.scene.key]);
    }

    startCountingUp() {
        this.text = this.startCount;
    }
}
