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

export function create(stageHeight, game) {
    let metrics;

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    const getSize = fp.flow(getBounds(game), fp.pick(["width", "height"]));
    const _calculateMetrics = fp.flow(getSize, calculateMetrics(stageHeight));

    const setSize = () => {
        metrics = _calculateMetrics();
        game.scale.setGameSize(metrics.width / metrics.scale, metrics.height / metrics.scale);
        _onSizeChange.dispatch(metrics);
    };
    setSize();

    window.onresize = fp.debounce(200, setSize);

    return {
        calculateMetrics: () => metrics,
    };
}
