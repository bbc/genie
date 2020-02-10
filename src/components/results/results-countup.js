/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import fp from "../../../lib/lodash/fp/fp.js";

const COUNTUP_STATE = {
    DELAYED: 0,
    COUNTING: 1,
    ENDED: 2,
};

export class ResultsCountup extends Phaser.GameObjects.Text {
    constructor(scene, config) {
        super(scene, 0, 0, undefined, config.textStyle);
        this.config = config;
        this.startCount = this.textFromTemplate(config.startCount, scene.transientData);
        this.endCount = this.textFromTemplate(config.endCount, scene.transientData);

        this.delayProgress = 0;
        this.currentValue = parseInt(this.startCount);
        this.numberOfTicks = this.endCount - this.startCount;

        this.text = this.startCount;
        this.setFixedSize(this.getFinalWidth(this.endCount), 0);

        this.countupState = COUNTUP_STATE.DELAYED;
        this.boundUpdateFn = this.update.bind(this);
        scene.events.on(Phaser.Scenes.Events.UPDATE, this.boundUpdateFn);
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

    update(_, dt) {
        if (this.countupState === COUNTUP_STATE.DELAYED) {
            this.incrementDelayCount(dt, this.config.startDelay);
        }
        if (this.countupState === COUNTUP_STATE.COUNTING) {
            this.incrementCount(dt, this.config.countupDuration);
        }
    }

    incrementDelayCount(dt, delay) {
        this.delayProgress += dt;
        if (this.delayProgress > delay) {
            this.countupState = COUNTUP_STATE.COUNTING;
        }
    }

    canPlaySound(oldValue, newValue) {
        //const fireRate = this.config.audio.fireRate >= 1 ? this.config.audio.fireRate : 1;
        return newValue !== oldValue ? true : false; //value % fireRate === 0;
    }

    incrementCount(dt, countupDuration) {
        this.currentValue += (dt / countupDuration) * this.numberOfTicks;
        this.previousText = this.text;
        this.text = parseInt(this.currentValue);
        if (this.currentValue >= this.endCount) {
            this.text = this.endCount;
            this.countupState = COUNTUP_STATE.ENDED;
            this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.boundUpdateFn);
        }
        if (this.config.audio && this.canPlaySound(this.previousText, this.text)) {
            const startRate = this.config.audio.startPlayRate || 1;
            const endRate = this.config.audio.endPlayRate || 1;
            const progress = this.currentValue / (this.endCount - this.startCount);
            const currentRate = startRate + progress * (endRate - startRate);
            this.scene.sound.play(this.config.audio.key, { rate: currentRate });
        }
    }
}
