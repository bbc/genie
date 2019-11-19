/**
 * @module core/scaler
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { calculateMetrics } from "./layout/calculate-metrics.js";

import fp from "../../lib/lodash/fp/fp.js";
import * as event from "./event-bus.js";

const getBounds = game => () => game.scale.parentSize;

const _onSizeChangeEventCreate = (channel, name) => ({
    dispatch: data => event.bus.publish({ channel, name, data }),
    add: callback => event.bus.subscribe({ channel, name, callback }),
});
const _onSizeChange = _onSizeChangeEventCreate("scaler", "sizeChange");
const px = val => Math.floor(val) + "px";

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
        /*
            TODO P3 Scaler notes [NT]
            Working version below sets the style of the canvas to maintain 4/3 section of game.
            To do this we only need to set the canvas height (width will map 1:1 if left alone)
            and the margins (to maintain center)
            Possibly worth checking if this is optimal

            * game.scale.resize - didn't end up using this.
              It sets the canvas width and height attributes.
              Probably not what we want?
            * Docs sometimes say use the NO_SCALE method but they lie!!! the method "NONE" is what should be used.

         */

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

    const resize = fp.flow(
        getMetrics,
        setSize,
    );

    resize();
    window.onresize = fp.debounce(500, resize);
}
