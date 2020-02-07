import fp from "../../../lib/lodash/fp/fp.js";

/**
 * Generates a safe frame that can be used to place elements
 *
 * @module layout/layout
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

//const defaultSafeAreaGroups = {
//    top: "topLeft",
//    left: "middleLeftSafe",
//    bottom: "bottomCenter",
//    right: "middleRightSafe",
//    minWidth: 64,
//};
const defaultSafeAreaGroups = {
    top: "topLeft",
    left: [{ group: "middleLeftSafe" }, { group: "topLeft", fixedWidth: 64 }],
    bottom: "bottomCenter",
    right: [{ group: "middleRightSafe" }, { group: "topRight", fixedWidth: 64 }],
};

export const getSafeArea = groups => (metrics, groupOverrides = {}) => {
    const safe = { ...defaultSafeAreaGroups, ...groupOverrides };
    //so the right hand side wants to be either top - 64 OR midRightSafe. Whichever is nearest

    const pad = metrics.isMobile ? { x: 0, y: 0 } : fp.mapValues(metrics.screenToCanvas, { x: 20, y: 10 });

    //const left = groups[safe.left].x + groups[safe.left].width + pad.x + fillLeft;

    //const left = groups[safe.left].x + groups[safe.left].width + pad.x + fillLeft;

    const getWidth = config => config.fixedWidth? metrics.screenToCanvas(config.fixedWidth) : groups[config.group].width;

    const xPlusWidth = safe.left.map(config => groups[config.group].x + getWidth(config))

    const left = Math.max(...xPlusWidth)  + pad.x;






    const top = safe.top ? groups[safe.top].y + groups[safe.top].height : metrics.borderPad - metrics.stageHeight / 2;

    const bottom = Math.min(groups[safe.bottom].y - pad.y, -top);

    const height = bottom - top;
    const width = groups[safe.right[0].group].x - left - pad.x;

    return new Phaser.Geom.Rectangle(left, top, width, height);
};
