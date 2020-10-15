/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
/* eslint-disable no-console */

import { getMetrics } from "../../scaler.js";
import fp from "../../../../lib/lodash/fp/fp.js";

const GRID_NAME = "grid";

const handleIfVisible = (gelButton, scene) => {
    const outerContainer = gelButton.rexContainer.parent.getTopmostSizer();
    const mouseY = scene.input.y;
    const centreY = scene.scale.displaySize.height / 2;
    const halfInnerHeight = outerContainer.innerHeight / 2;
    const topY = centreY - halfInnerHeight;
    const bottomY = centreY + halfInnerHeight;
    if (mouseY >= topY && mouseY <= bottomY) onClickPlaceholder(gelButton);
};

const onClickPlaceholder = gelButton => console.log(`Clicked ${gelButton.config.id}`);

const updatePanelOnScroll = panel => () => {
    if (!panel.a11yWrapper) return;

    if (!panel.a11yWrapper.style.cssText) {
        panel.a11yWrapper.style.position = "absolute";
        panel.a11yWrapper.style.top = "0px";
    }
    const space = panel.space.top;
    const totalItemsHeight = getItemsHeight(panel);
    const panelInnerHeight = panel.height - space;
    const yOffset = -(totalItemsHeight - panelInnerHeight) * panel.t * getMetrics().scale;
    panel.a11yWrapper.style.top = yOffset + "px";
};

const getItemsHeight = panel => {
    const items = getPanelItems(panel);
    return items.length * (items[0].height + panel.space.top);
};

const getPanelItems = panel => panel.getByName(GRID_NAME, true).getElement("items");

const updatePanelOnFocus = panel => rexLabel => {
    const visibleBounds = getVisibleRangeBounds(panel);
    const itemBounds = getItemBounds(panel, rexLabel);
    fp.cond([
        [
            (visible, item) => item.lower < visible.lower,
            (visible, item) => updatePanelOffset(panel, item.lower - visible.lower),
        ],
        [
            (visible, item) => item.upper > visible.upper,
            (visible, item) => updatePanelOffset(panel, item.upper - visible.upper),
        ],
        [() => true, () => {}],
    ])(visibleBounds, itemBounds);
};

const getVisibleRangeBounds = panel => {
    const itemsHeight = getItemsHeight(panel);
    const maxOffset = getMaxOffset(panel);
    const lower = maxOffset * panel.t;
    const upper = itemsHeight - (maxOffset - lower);
    return { lower, upper };
};

const getItemBounds = (panel, rexLabel) => {
    const idx = getPanelItems(panel).findIndex(item => item === rexLabel);
    const lower = idx * rexLabel.height + idx * panel.space.top;
    const upper = lower + rexLabel.height;
    return { lower, upper };
};

const updatePanelOffset = (panel, offset) => {
    const maxOffset = getMaxOffset(panel);
    const tDelta = offset / maxOffset;
    panel.t += tDelta;
};

const getMaxOffset = panel => {
    const visibleWindowHeight = panel.minHeight - panel.space.top * 2;
    const itemsHeight = getItemsHeight(panel);
    return itemsHeight - visibleWindowHeight;
};

export { handleIfVisible, updatePanelOnFocus, updatePanelOnScroll };
