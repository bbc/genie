/**
 * Generates a safe frame that can be used to place elements
 *
 * @module layout/layout
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
const defaultSafeAreaGroups = {
    top: "topLeft",
    left: [{ id: "middleLeftSafe" }, { id: "topLeft", fixedWidth: 64 }],
    bottom: "bottomCenter",
    right: [{ id: "middleRightSafe" }, { id: "topRight", fixedWidth: 64 }],
};

export const getSafeAreaFn = groups => (metrics, groupOverrides = {}) => {
    const safe = { ...defaultSafeAreaGroups, ...groupOverrides };
    const pad = metrics.isMobile ? { x: 0, y: 0 } : fp.mapValues(metrics.screenToCanvas, { x: 20, y: 10 });

    const getWidth = group => (group.fixedWidth ? metrics.screenToCanvas(group.fixedWidth) : groups[group.id].width);
    const getRightSide = group => groups[group.id].x + getWidth(group);
    const getLeftSide = group => groups[group.id].x - getWidth(group) + groups[group.id].width;

    const left = Math.max(...safe.left.map(getRightSide)) + pad.x;
    const top = safe.top ? groups[safe.top].y + groups[safe.top].height : metrics.borderPad - metrics.stageHeight / 2;
    const width = Math.min(...safe.right.map(getLeftSide)) - pad.x - left;
    const height = Math.min(groups[safe.bottom].y - pad.y, -top) - top;

    return new Phaser.Geom.Rectangle(left, top, width, height);
};
