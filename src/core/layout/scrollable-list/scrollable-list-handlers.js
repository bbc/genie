/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
/* eslint-disable no-console */

import fp from "../../../../lib/lodash/fp/fp.js";

const handleIfVisible = (gelButton, scene) => {
    const panel = gelButton.rexContainer.parent.getTopmostSizer();
    const safeArea = scene.layout.getSafeArea({}, false);
    const height = scene.scale.displaySize.height;
    const topY = height / 2 + safeArea.y + panel.space.top;
    const bottomY = topY + panel.innerHeight;
    const mouseY = scene.input.y;
    if (mouseY >= topY && mouseY <= bottomY) onClickPlaceholder(gelButton);
};

const onClickPlaceholder = gelButton => console.log(`Clicked ${gelButton.config.id}`);

const updatePanelOnScroll = panel => () =>
    getPanelItems(panel).map(item => item.children[0].setElementSizeAndPosition());

const getPanelItems = panel => panel.getByName("grid", true).getElement("items");

const updatePanelOnFocus = panel => rexLabel => {
    const visibleBounds = getVisibleRangeBounds(panel);
    const itemBounds = getItemBounds(panel, rexLabel);
    fp.cond([
        [(vb, ib) => ib.lower < vb.lower, (vb, ib) => updateScrollPosition(panel, ib.lower - vb.lower)],
        [(vb, ib) => ib.upper > vb.upper, (vb, ib) => updateScrollPosition(panel, ib.upper - vb.upper)],
        [() => true, () => {}],
    ])(visibleBounds, itemBounds);
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
    const tDelta = offset / maxOffset;
    const newT = panel.t + tDelta;
    const tThreshold = 1 / getPanelItems(panel).length;
    fp.cond([
        [t => t < tThreshold, () => panel.setT(0)],
        [t => t > 1 - tThreshold, () => panel.setT(1)],
        [() => true, t => panel.setT(t)],
    ])(newT);
};

const getMaxOffset = panel => {
    const visibleWindowHeight = panel.minHeight - panel.space.top * 2;
    return getItemsHeight(panel) - visibleWindowHeight;
};

export { handleIfVisible, updatePanelOnFocus, updatePanelOnScroll };
