/**
 * @module core/scaler
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { calculateMetrics } from "./layout/calculate-metrics.js";

import fp from "../../lib/lodash/fp/fp.js";
import * as signal from "./signal-bus.js";

const getBounds = game => () => game.scale.parentSize;

const _onSizeChangeSignalCreate = (channel, name) => ({
    dispatch: data => signal.bus.publish({ channel, name, data }),
    add: callback => signal.bus.subscribe({ channel, name, callback }),
});
const _onSizeChange = _onSizeChangeSignalCreate("scaler", "sizeChange");
export const onScaleChange = { add: _onSizeChange.add };

export let getMetrics;

export function init(stageHeight, game) {

    //TODO P3 unsure if any of this is now relevant NT
    //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    //game.scale.pageAlignHorizontally = true;
    //game.scale.pageAlignVertically = true;
    //game.scale.fullScreenTarget = document.body;

    getMetrics = fp.flow(
        getBounds(game),
        fp.pick(["width", "height"]),
        calculateMetrics(stageHeight),
    );

    const setSize = metrics => {
        //TODO P3 part of re-enabling the scaler may need this to work again [NT]
        //game.scale.setGameSize(metrics.stageWidth, metrics.stageHeight);
        //_onSizeChange.dispatch(metrics);
    };

    const resize = fp.flow(
        getMetrics,
        setSize,
    );

    resize();
    window.onresize = fp.debounce(200, resize);
}
