/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../layout/metrics.js";

export const getBaseDefaults = () => {
    const genie = __GENIE__;

    return {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        antialias: true,
        multiTexture: true,
        banner: true,
        title: "BBC Games Genie",
        version: `${genie.version}${genie.build ? " / Build: " + genie.build : ""}`, //TODO add Jenkins JOB_NAME ?
        clearBeforeRender: false,
        scale: { mode: Phaser.Scale.NONE },
        input: { windowEvents: false },
    };
};
