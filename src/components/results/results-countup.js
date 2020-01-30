/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import fp from "../../../lib/lodash/fp/fp.js";

export class ResultsCountup extends Phaser.GameObjects.Text {
    constructor(scene, config) {
        super(scene, 0, 0, undefined, config.textStyle);
        this.config = config;
        this.startCount = this.textFromTemplate(config.startCount, scene.transientData);
        this.endCount = this.textFromTemplate(config.endCount, scene.transientData);
        this.text = this.startCount;
        this.setFixedSize(this.getFinalWidth(this.endCount), 0);
        this.startCountWithDelay(config.startDelay);
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

    canPlaySound(value) {
        const fireRate = this.config.audio.fireRate >= 1 ? this.config.audio.fireRate : 1;
        return value % fireRate === 0;
    }

    incrementCountByOne() {
        const currentValue = parseInt(this.text);
        this.text = currentValue + 1;
        if (this.config.audio && this.canPlaySound(currentValue + 1)) {
            const startRate = this.config.audio.startPlayRate || 1;
            const endRate = this.config.audio.endPlayRate || 1;
            const progress = (currentValue + 1) / (this.endCount - this.startCount);
            const currentRate = startRate + progress * (endRate - startRate);
            this.scene.sound.play(this.config.audio.key, { rate: currentRate });
        }
    }

    startCountWithDelay(startDelay) {
        this.scene.time.delayedCall(startDelay, this.startCountingUp, undefined, this);
    }

    startCountingUp() {
        if (this.startCount === this.endCount) {
            return;
        }
        const repeat = this.endCount - this.startCount - 1;
        const delay = repeat ? this.config.countupDuration / repeat : undefined;
        this.scene.time.addEvent({
            delay,
            callback: this.incrementCountByOne,
            callbackScope: this,
            repeat,
        });
    }
}
