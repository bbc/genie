/**
 * @module core/layout/scrollable-list-covers
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { getPanelY } from "./scrollable-panel.js";

const getCoverPositions = (scene, covers, padding) => {
	const safeArea = getPanelY(scene);
	return {
		top: covers.top
			? {
					y: safeArea.y - safeArea.height / 2 + padding.y,
			  }
			: null,
		bottom: covers.bottom
			? {
					y: safeArea.y + safeArea.height / 2 - padding.y,
			  }
			: null,
	};
};

const getCoverPadding = config => {
	return { y: config.y * config.outerPadFactor, x: config.x * config.outerPadFactor };
};

export const resizeCovers = (scene, panel, covers, config) => {
	if (!panel || !covers) return;
	const padding = getCoverPadding(config);
	const positions = getCoverPositions(scene, covers, padding);
	const panelWidth = panel.getChildrenWidth();
	covers.top
		?.setX(0 - padding.x)
		.setY(positions.top.y)
		.setScale(panelWidth / covers.top.width);
	covers.bottom
		?.setX(0 - padding.x)
		.setY(positions.bottom.y)
		.setScale(panelWidth / covers.bottom.width);
};

export const createCovers = (scene, config) =>
	scene.config.listCovers && {
		top: config.top ? scene.add.image(0, 0, config.top.key) : null,
		bottom: config.bottom ? scene.add.image(0, 0, config.bottom.key) : null,
	};
