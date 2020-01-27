/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import fp from "../../../lib/lodash/fp/fp.js";

export class ResultsText extends Phaser.GameObjects.Text {
    constructor(scene, textConfig) {
        super(scene, 0, 0, undefined, textConfig.textStyle);
        this.textConfig = textConfig;
        this.setTextFromTemplate(textConfig.content, scene.transientData);
    }

    setTextFromTemplate(templateString, transientData) {
        const template = fp.template(templateString);
        this.text = template(transientData[this.scene.scene.key]);
    }
}
