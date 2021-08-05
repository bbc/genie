/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { gmi } from "../../core/gmi/gmi.js";
import fp from "../../../lib/lodash/fp/fp.js";

export class ResultsSprite extends Phaser.GameObjects.Sprite {
	constructor(scene, config) {
		const template = fp.template(config.key);
		const templateKey = template(scene.transientData[scene.scene.key]);
		super(scene, 0, 0, templateKey, config.frame);
		this.config = config;
		this.setOrigin(0, 0);

		if (config.anim && gmi.getAllSettings().motion) {
			scene.add.existing(this);
			scene.anims.create({
				...config.anim,
				key: templateKey,
				frames: scene.anims.generateFrameNumbers(templateKey, config.anim.frames),
			});
			this.play(templateKey);
		}
	}
}
