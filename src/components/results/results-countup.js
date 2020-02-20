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
        this.initialise();
        this.setTextAndFixedSize();
        this.startUpdateLoop(scene);
    }

    initialise() {
        this.delayProgress = 0;
        this.numberOfTicks = 0;
        this.currentValue = parseInt(this.startCount);
        this.countupRange = this.endCount - this.startCount;
        this.shouldSingleTick = this.config.audio ? this.countupRange <= this.config.audio.singleTicksRange : false;
    }

    setTextAndFixedSize() {
        this.text = this.startCount;
        this.setFixedSize(this.getFinalWidth(this.endCount), 0);
    }

    startUpdateLoop(scene) {
        this.countupState = COUNTUP_STATE.DELAYED;
        this.boundUpdateFn = this.update.bind(this);
        scene.events.on("update", this.boundUpdateFn);
        scene.events.once("shutdown", () => {
            scene.events.off("update", this.boundUpdateFn);
        });
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
            this.incrementCount(dt, this.config);
        }
    }

    incrementDelayCount(dt, delay) {
        this.delayProgress += dt;
        if (this.delayProgress > delay) {
            this.countupState = COUNTUP_STATE.COUNTING;
        }
    }

    canPlaySound(progress, ticksPerSecond, countupDuration) {
        if (ticksPerSecond && !this.shouldSingleTick) {
            const expectedNumberOfTicks = (progress * ticksPerSecond * countupDuration) / 1000;
            return expectedNumberOfTicks > this.numberOfTicks ? true : false;
        }
        return this.text !== this.previousText ? true : false;
    }

    playAudio(progress) {
        const startRate = this.config.audio.startPlayRate || 1;
        const endRate = this.config.audio.endPlayRate || 1;
        const currentRate = startRate + progress * (endRate - startRate);
        this.scene.sound.play(this.config.audio.key, { rate: currentRate });
        this.numberOfTicks += 1;
    }

    incrementCount(dt, config) {
        this.currentValue += (dt / config.countupDuration) * this.countupRange;
        this.previousText = this.text;
        this.text = parseInt(this.currentValue);
        if (this.currentValue >= this.endCount) {
            this.text = this.endCount;
            this.countupState = COUNTUP_STATE.ENDED;
        }
        const progress = (this.currentValue - this.startCount) / (this.endCount - this.startCount);
        if (this.config.audio && this.canPlaySound(progress, config.audio.ticksPerSecond, config.countupDuration)) {
            this.playAudio(progress);
        }
    }
}
