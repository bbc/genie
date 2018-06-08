/**
 *
 *  @module core/scaler
 */
import { calculateMetrics } from "./layout/calculate-metrics.js";

import fp from "../../lib/lodash/fp/fp.js";

const getBounds = game => () => game.scale.getParentBounds();

export function create(stageHeight, game) {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    const onScaleChange = new Phaser.Signal();

    const getSize = fp.flow(getBounds(game), fp.pick(["width", "height"]));
    const _calculateMetrics = fp.flow(getSize, calculateMetrics(stageHeight));
    let metrics = _calculateMetrics();

    const setSize = () => {
        metrics = _calculateMetrics();
        game.scale.setGameSize(metrics.width / metrics.scale, metrics.height / metrics.scale);
        onScaleChange.dispatch(metrics.width, metrics.height, metrics.scale, metrics.stageHeight);
    };

    const onSizeChange = fp.flow(getSize, setSize);

    //TODO investigate why using using game.scale.setResizeCallback(onSizeChange); gets called repeatedly.
    game.scale.onSizeChange.add(onSizeChange);
    //game.scale.setResizeCallback(onSizeChange);

    return {
        onScaleChange,
        calculateMetrics: () => metrics,
    };
}
