/**
 *
 *  @module core/scaler
 */
import { calculateMetrics } from "./layout/calculate-metrics.js";

import fp from "../../lib/lodash/fp/fp.js";
import * as signal from "./signal-bus.js";

const getBounds = game => () => game.scale.getParentBounds();

const _onSizeChangeSignalCreate = (channel, name) => ({
    dispatch: data => signal.bus.publish({ channel, name, data }),
    add: callback => signal.bus.subscribe({ channel, name, callback }),
});
const _onSizeChange = _onSizeChangeSignalCreate("scaler", "sizeChange");
export const onScaleChange = { add: _onSizeChange.add };

export let getMetrics;

export function init(stageHeight, game) {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    getMetrics = fp.flow(getBounds(game), fp.pick(["width", "height"]), calculateMetrics(stageHeight));

    const setSize = metrics => {
        game.scale.setGameSize(metrics.width / metrics.scale, metrics.height / metrics.scale);
        _onSizeChange.dispatch(metrics);
    };

    const resize = fp.flow(getMetrics, setSize);

    resize();
    window.onresize = fp.debounce(200, resize);
}
