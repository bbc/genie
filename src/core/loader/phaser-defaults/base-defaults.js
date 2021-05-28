/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../layout/metrics.js";

export const getBaseDefaults = () => {
    const { version, build, job } = __BUILD_INFO__;
    const jobCleaned = job ? " " + job.replace(/[-_]/g, " ") + " b" : " B";

    return {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        antialias: true,
        multiTexture: true,
        banner: true,
        title: "BBC Games Genie",
        version: `${version}${build ? " /" + jobCleaned + "uild: " + build : ""}`,
        clearBeforeRender: false,
        scale: { mode: Phaser.Scale.NONE },
        input: { windowEvents: false, activePointers: 4 },
    };
};
