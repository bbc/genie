/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../../lib/lodash/fp/fp.js";

const createChildPanel = scene =>
	scene.rexUI.add.sizer({ orientation: "x", space: { item: 0 }, name: "gridContainer" });

const getConfig = scene => {
	const { listPadding: space } = scene.config;
	const safeArea = getPanelY(scene);
	const outer = { x: space.x * space.outerPadFactor, y: space.y * space.outerPadFactor };

	return {
		y: safeArea.y,
		height: safeArea.height,
		scrollMode: 0,
		slider: {
			track: scene.add.image(0, 0, `${scene.assetPrefix}.scrollbar`),
			thumb: scene.add.image(0, 0, `${scene.assetPrefix}.scrollbarHandle`),
			width: space.x,
		},
		space: { left: outer.x, right: outer.x, top: outer.y, bottom: outer.y, panel: space.x },
	};
};

export const getPanelY = scene => {
	const safeArea = scene.layout.getSafeArea({}, false);
	return { y: safeArea.height / 2 + safeArea.y, height: safeArea.height };
};

export const createScrollablePanel = (scene, mode, parent) => {
	const config = getConfig(scene);
	const child = createChildPanel(scene, mode, parent);
	const panel = { child };

	const scrollablePanel = scene.rexUI.add.scrollablePanel({ ...config, panel });

	scrollablePanel.name = mode;
	scrollablePanel.layout();
	scrollablePanel.makeAccessible = fp.noop;
	scrollablePanel.reset = () => parent.reset();
	scrollablePanel.getBoundingRect = () => scene.layout.getSafeArea({}, false);

	return { scrollablePanel, child };
};
