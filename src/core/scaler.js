/**
 *
 *  @module core/scaler
 */
import { GEL_MIN_ASPECT_RATIO, calculateMetrics } from "./layout/calculate-metrics.js";

import fp from "../../lib/lodash/fp/fp.js";

const getScale = fp.curry((scaleMethods, stageHeight, { width, height }) => {
    const scale = scaleMethods[width / height >= GEL_MIN_ASPECT_RATIO ? "wide" : "narrow"](width, height);
    return { width, height, scale, stageHeight };
});

const getBounds = game => () => game.scale.getParentBounds();

export function create(stageHeight, game) {

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    const onScaleChange = new Phaser.Signal();

    const scaleMethods = {
        wide: (width, height) => height / stageHeight,
        narrow: width => width / stageHeight / GEL_MIN_ASPECT_RATIO,
    };

    const getSize = fp.flow(getBounds(game), fp.pick(["width", "height"]), getScale(scaleMethods, stageHeight));
    const _calculateMetrics = fp.flow(getSize, calculateMetrics);
    let metrics = _calculateMetrics();

    const setSize = ({ width, height, scale, stageHeight }) => {
        metrics = _calculateMetrics();
        onScaleChange.dispatch(width, height, scale, stageHeight);
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
