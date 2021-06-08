/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../layout/metrics.js";
export var getBaseDefaults = function getBaseDefaults() {
  var version = "0.0.1",
      build = "int",
      job = "123";
  var jobCleaned = job ? " " + job.replace(/[-_]/g, " ") + " b" : " B";
  return {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    antialias: true,
    multiTexture: true,
    banner: true,
    title: "BBC Games Genie",
    version: "".concat(version).concat(build ? " /" + jobCleaned + "uild: " + build : ""),
    clearBeforeRender: false,
    scale: {
      mode: Phaser.Scale.NONE
    },
    input: {
      windowEvents: false
    }
  };
};