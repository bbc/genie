/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../layout/metrics.js";

const genie = __GENIE__

export const getBaseDefaults = () => ({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    antialias: true,
    multiTexture: true,
    banner: true,
    title: "BBC Games Genie",
    version: `${genie.version} / Build: ${genie.build}`, //TODO add JEnkins JOB_NAME ?
    clearBeforeRender: false,
    scale: { mode: Phaser.Scale.NONE },
    input: { windowEvents: false },
});
