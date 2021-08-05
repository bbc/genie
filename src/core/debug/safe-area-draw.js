/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { onScaleChange } from "../scaler.js";
import { eventBus } from "../event-bus.js";

const createSafeArea = parent => {
	const safeArea = [parent.scene.add.tileSprite(0, 0, 0, 0, "gelDebug.FF0030-hatch")];
	safeArea.map(area => parent.add(area));
	return safeArea;
};

export const create = parent => {
	const safeAreaDebugElement = [...createSafeArea(parent)];

	const resize = () => {
		const mirrorY = false;
		const { top, width, height } = parent.scene.layout.getSafeArea({}, mirrorY);
		safeAreaDebugElement[0].setSize(width, height);
		safeAreaDebugElement[0].setPosition(0, (height - Math.abs(top) * 2) / 2);
	};

	onScaleChange.add(resize);
	resize();

	const shutdown = () => eventBus.removeSubscription({ channel: "scaler", name: "sizeChange", callback: resize });

	parent.scene.events.once("shutdown", shutdown);

	const toggle = () => {
		const visible = !safeAreaDebugElement[0].visible;
		safeAreaDebugElement.forEach(el => (el.visible = visible));
		return visible;
	};

	toggle();

	return toggle;
};
