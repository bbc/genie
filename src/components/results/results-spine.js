/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { gmi } from "../../core/gmi/gmi.js";

export class ResultsSpine {
	constructor(scene, config) {
		this.config = config;
		let animation;
		animation = scene.add.spine(config.offsetX, config.offsetY, config.key, config.animationName, config.loop);
		scene.add.existing(animation);
		Object.assign(animation, config.props);
		animation.setSize(animation.width * animation.scale, animation.height * animation.scale);
		animation.active = gmi.getAllSettings().motion;

		return animation;
	}
}
