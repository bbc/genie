/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
/* eslint-disable no-console */

import fp from "../../../../lib/lodash/fp/fp.js";

const WHEEL_SCROLL_FACTOR = 0.005;

const updatePanelOnScroll = panel => () =>
    getPanelItems(panel).map(item => enableOrDisableButton(panel, item).setElementSizeAndPosition());

const isItemVisibleInPanel = (panel, item) => {
    const visibleBounds = getVisibleRangeBounds(panel);
    const itemBounds = getItemBounds(panel, item);
    return !(itemBounds.lower < visibleBounds.lower || itemBounds.upper > visibleBounds.upper);
};

const enableOrDisableButton = (panel, item) =>
    isItemVisibleInPanel(panel, item) ? item.setInteractive() : item.disableInteractive();

const getPanelItems = panel => panel.getByName("grid", true).getElement("items");

const updatePanelOnFocus = panel => rexLabel => {
    const visibleBounds = getVisibleRangeBounds(panel);
    const itemBounds = getItemBounds(panel, rexLabel);
    const updateScrollPositionIfItemNotVisible = fp.cond([
        [(vb, ib) => ib.lower < vb.lower, (vb, ib) => updateScrollPosition(panel, ib.lower - vb.lower)],
        [(vb, ib) => ib.upper > vb.upper, (vb, ib) => updateScrollPosition(panel, ib.upper - vb.upper)],
        [() => true, () => {}],
    ]);
    updateScrollPositionIfItemNotVisible(visibleBounds, itemBounds);
};

const getVisibleRangeBounds = panel => {
    const itemsHeight = getItemsHeight(panel);
    const maxOffset = getMaxOffset(panel);
    const lower = maxOffset * panel.t;
    return { lower, upper: itemsHeight - (maxOffset - lower) };
};

const getItemsHeight = panel => {
    const items = getPanelItems(panel);
    return items.length * (items[0].height + panel.space.top);
};

const getItemBounds = (panel, rexLabel) => {
    const idx = getPanelItems(panel).findIndex(item => item === rexLabel);
    const lower = idx * rexLabel.height + idx * panel.space.top;
    return { lower, upper: lower + rexLabel.height };
};

const updateScrollPosition = (panel, offset) => {
    const maxOffset = getMaxOffset(panel);
    const currentT = panel.t; // 0 <= t <= 1; scrollbar position
    const tDelta = offset / maxOffset;
    const newT = currentT + tDelta;
    const clampThreshold = 1 / getPanelItems(panel).length;
    const clampToRangeEndOrSetT = fp.cond([
        [t => t < clampThreshold, () => panel.setT(0)],
        [t => t > 1 - clampThreshold, () => panel.setT(1)],
        [fp.stubTrue, t => panel.setT(t)],
    ]);
    clampToRangeEndOrSetT(newT);
};

const getMaxOffset = panel => {
    const visibleWindowHeight = panel.minHeight - panel.space.top * 2;
    return getItemsHeight(panel) - visibleWindowHeight;
};

const updatePanelOnWheel = panel => e => {
    if (!panel.visible || !panel.isInTouching()) return;
    const delta = e.deltaY * WHEEL_SCROLL_FACTOR;
    const t = Math.min(Math.max(0, panel.t + delta), 1);
    panel.setT(t);
};

export { updatePanelOnFocus, updatePanelOnScroll, updatePanelOnWheel };
