/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { BORDER_PAD_RATIO, GEL_MAX_ASPECT_RATIO, GEL_MIN_ASPECT_RATIO, CANVAS_HEIGHT } from "../layout/metrics.js";
import { getMetrics, onScaleChange } from "../scaler.js";
import { eventBus } from "../event-bus.js";

const getPaddingWidth = canvas => Math.max(canvas.width, canvas.height) * BORDER_PAD_RATIO;

const createOuterPadding = parent => {
	const borders = [
		parent.scene.add.tileSprite(0, 0, 0, 0, "gelDebug.FF0030-hatch"),
		parent.scene.add.tileSprite(0, 0, 0, 0, "gelDebug.FF0030-hatch"),
		parent.scene.add.tileSprite(0, 0, 0, 0, "gelDebug.FF0030-hatch"),
		parent.scene.add.tileSprite(0, 0, 0, 0, "gelDebug.FF0030-hatch"),
	];

	borders.map(border => parent.add(border));

	return borders;
};

const create43Area = parent => {
	const area = parent.scene.add.tileSprite(0, 0, 0, 0, "gelDebug.FFCC00-hatch");
	parent.add(area);

	return [area];
};

const aspect43 = 4 / 3;

export const create = parent => {
	const safeAreaDebugElements = [...create43Area(parent), ...createOuterPadding(parent)];

	const resize = () => {
		const metrics = getMetrics();
		const container = parent.scene.game.scale.parent;
		const viewAspectRatio = container.offsetWidth / container.offsetHeight;
		const aspectRatio = Math.min(GEL_MAX_ASPECT_RATIO, viewAspectRatio);
		const size =
			aspectRatio <= aspect43
				? { width: CANVAS_HEIGHT * aspect43, height: CANVAS_HEIGHT }
				: { width: aspectRatio * CANVAS_HEIGHT, height: CANVAS_HEIGHT };
		const pad = getPaddingWidth(size);

		const areaWidth = GEL_MIN_ASPECT_RATIO * parent.scene.game.canvas.height;
		const areaHeight = parent.scene.game.canvas.height;

		safeAreaDebugElements[0].setSize(areaWidth, areaHeight);

		safeAreaDebugElements[1].setPosition(0, (pad - size.height) / 2);
		safeAreaDebugElements[1].setSize(size.width, pad);

		safeAreaDebugElements[2].setPosition(0, (size.height - pad) / 2);
		safeAreaDebugElements[2].setSize(size.width, pad);

		safeAreaDebugElements[3].setPosition((pad - size.width) / 2, 0);
		safeAreaDebugElements[3].setSize(pad, size.height);

		safeAreaDebugElements[4].setPosition((size.width - pad) / 2, 0);
		safeAreaDebugElements[4].setSize(pad, size.height);

		safeAreaDebugElements.map(el => el.setTileScale(1 / metrics.scale));
	};

	onScaleChange.add(resize);
	resize();

	const shutdown = () => eventBus.removeSubscription({ channel: "scaler", name: "sizeChange", callback: resize });

	parent.scene.events.once("shutdown", shutdown);

	const toggle = () => {
		const visible = !safeAreaDebugElements[0].visible;
		safeAreaDebugElements.forEach(el => (el.visible = visible));
		return visible;
	};

	toggle();

	return toggle;
};
