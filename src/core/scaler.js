/**
 * @module core/scaler
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { calculateMetrics } from "./layout/metrics.js";

import fp from "../../lib/lodash/fp/fp.js";
import { eventBus } from "./event-bus.js";

const getBounds = game => () => game.scale.parentSize;

const _onSizeChangeEventCreate = (channel, name) => ({
	dispatch: data => eventBus.publish({ channel, name, data }),
	add: callback => eventBus.subscribe({ channel, name, callback }),
});
const _onSizeChange = _onSizeChangeEventCreate("scaler", "sizeChange");
const px = val => Math.floor(val) + "px";

export const onScaleChange = { add: _onSizeChange.add };

export let getMetrics;

export const init = (stageHeight, game) => {
	getMetrics = fp.flow(getBounds(game), fp.pick(["width", "height"]), calculateMetrics(stageHeight));

	const setSize = metrics => {
		const under4by3 = game.scale.parent.offsetWidth / game.scale.parent.offsetHeight < 4 / 3;

		const viewHeight = under4by3 ? game.scale.parent.offsetWidth * (3 / 4) : game.scale.parent.offsetHeight;

		game.canvas.style.height = px(viewHeight);

		const bounds = game.canvas.getBoundingClientRect();
		const marginLeft = (game.scale.parent.offsetWidth - bounds.width) / 2;
		const marginTop = (game.scale.parent.offsetHeight - bounds.height) / 2;

		game.canvas.style.marginLeft = px(marginLeft);
		game.canvas.style.marginTop = px(marginTop);
		game.scale.refresh();

		_onSizeChange.dispatch(metrics);
	};

	const resize = fp.flow(getMetrics, setSize);

	resize();
	window.onresize = fp.debounce(750, resize);
};
