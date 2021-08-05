/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import fp from "../../../lib/lodash/fp/fp.js";

export const playRowAudio = (scene, containers) => {
	containers.forEach(row => {
		const config = row.rowConfig;
		if (config.audio) {
			const template = fp.template(config.audio.key);
			const templatedKey = template(scene.transientData[scene.scene.key]);
			scene.time.addEvent({
				delay: config.audio.delay,
				callback: () => scene.sound.play(templatedKey),
			});
		}
	});
};
