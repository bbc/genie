/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../../core/gmi/gmi.js";

const tween = (scene, targets, containers) => {
	containers.forEach((container, index) => {
		const config = container.rowConfig;
		if (config.transition) {
			if (!gmi.getAllSettings().motion) {
				config.transition.duration = 0;
			}
			scene.add.tween({ targets: targets[index], ...config.transition });
		}
	});
};

export const tweenRows = (scene, containers) => tween(scene, containers, containers);
export const tweenRowBackdrops = (scene, targets, containers) => tween(scene, targets, containers);
