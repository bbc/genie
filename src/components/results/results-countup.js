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
        this.startCountWithDelay(countupConfig.startDelay);
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
        const fireRate = Math.max(this.countupConfig.audio.fireRate, 1);
        return value % fireRate === 0;
    }

    incrementCountByOne() {
        const startRate = this.countupConfig.audio.startPlayRate || 1;
        const endRate = this.countupConfig.audio.endPlayRate || 1;
        const currentValue = parseInt(this.text);
        this.text = currentValue + 1;
        const progress = (currentValue + 1) / (this.endCount - this.startCount);
        const currentRate = startRate + progress * (endRate - startRate);
        if (this.countupConfig.audio && this.canPlaySound(currentValue + 1)) {
            this.scene.sound.play(this.countupConfig.audio.key, { rate: currentRate });
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
        const delay = repeat ? this.countupConfig.countupDuration / repeat : this.countupConfig.countupDuration;
        this.scene.time.addEvent({
            delay,
            callback: this.incrementCountByOne,
            callbackScope: this,
            repeat,
        });
    }
}
