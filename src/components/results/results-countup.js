/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import fp from "../../../lib/lodash/fp/fp.js";

const COUNTUP_STATE = {
	INITIALISED: 0,
	DELAYED: 1,
	COUNTING: 2,
	ENDED: 3,
};

const ResultsCountup = gameObjectType =>
	class ResultsCountup extends gameObjectType {
		constructor(scene, config, ...args) {
			super(...args);
			this.config = config;
			this.startCount = this.textFromTemplate(config.startCount, scene.transientData);
			this.endCount = this.textFromTemplate(config.endCount, scene.transientData);
			this.initialise();
			this.setTextToMaxSize();
			this.startUpdateLoop(scene);
		}

		initialise() {
			this.delayProgress = 0;
			this.numberOfTicks = 0;
			this.currentValue = parseInt(this.startCount);
			this.countupRange = this.endCount - this.startCount;
			this.shouldSingleTick = this.config.audio ? this.countupRange <= this.config.audio.singleTicksRange : false;
		}

		setTextToMaxSize() {
			this.text = this.endCount;
		}

		startUpdateLoop(scene) {
			this.countupState = COUNTUP_STATE.INITIALISED;
			this.boundUpdateFn = this.update.bind(this);
			scene.events.on("update", this.boundUpdateFn);
			scene.events.once("shutdown", () => {
				scene.events.off("update", this.boundUpdateFn);
			});
		}

		textFromTemplate(templateString, transientData) {
			const template = fp.template(templateString);
			return template(transientData[this.scene.scene.key]);
		}

		update(_, dt) {
			if (this.countupState === COUNTUP_STATE.INITIALISED) {
				this.text = this.startCount;
				this.countupState = COUNTUP_STATE.DELAYED;
			}
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
	};

export class ResultsTextCountup extends ResultsCountup(Phaser.GameObjects.Text) {
	constructor(scene, config) {
		super(scene, config, scene, 0, 0, undefined, config.textStyle);
	}
}

export class ResultsBitmapTextCountup extends ResultsCountup(Phaser.GameObjects.BitmapText) {
	constructor(scene, config) {
		super(scene, config, scene, 0, 0, config.bitmapFont, undefined, config.size);
	}
}
