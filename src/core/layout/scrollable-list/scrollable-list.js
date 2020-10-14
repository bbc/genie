/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { assetKey } from "./scrollable-list-helpers.js";
import { createGelButton, scaleButton } from "./scrollable-list-buttons.js";
import { getMetrics } from "../../scaler.js";
import fp from "../../../../lib/lodash/fp/fp.js";

const scrollableList = scene => {
    const panelConfig = getPanelConfig(scene);
    const scrollableListPanel = scene.rexUI.add.scrollablePanel(panelConfig).layout();
    scrollableListPanel.updatePanelOnScroll = updatePanelOnScroll(scrollableListPanel);
    scrollableListPanel.updatePanelOnFocus = updatePanelOnFocus(scrollableListPanel);
    scene.input.topOnly = false;
    scene.scale.on(
        "resize",
        fp.debounce(100, () => resizePanel(scene, scrollableListPanel)),
        scene,
    );
    setupEvents(scrollableListPanel);
    return scrollableListPanel;
};

const getPanelConfig = scene => {
    const config = scene.config;
    const { assetKeys: keys } = config;
    const safeArea = scene.layout.getSafeArea({}, false);
    return {
        height: safeArea.height,
        scrollMode: 0,
        background: scene.add.image(0, 0, assetKey(keys.background, keys)),
        panel: { child: createPanel(scene) },
        slider: {
            track: scene.add.image(0, 0, assetKey(keys.scrollbar, keys)),
            thumb: scene.add.image(0, 0, assetKey(keys.scrollbarHandle, keys)),
            width: config.space,
        },
        space: {
            left: config.space,
            right: config.space,
            top: config.space,
            bottom: config.space,
            panel: config.space,
        },
    };
};

const createPanel = scene => {
    const sizer = scene.rexUI.add.sizer({ orientation: "x", space: { item: 0 } });
    sizer.add(createTable(scene), { expand: true });
    return sizer;
};

const createTable = scene => {
    const table = scene.rexUI.add.gridSizer({
        column: 1,
        row: scene.config.items.length,
        space: { row: scene.config.space },
        name: "grid",
    });

    scene.config.items.forEach((item, idx) => {
        table.add(createItem(scene, item), 0, idx, "top", 0, true);
    });

    return scene.rexUI.add
        .sizer({
            orientation: "y",
        })
        .add(table, 1, "center", 0, true);
};

const createItem = (scene, item) =>
    scene.rexUI.add.label({
        orientation: 0,
        icon: createGelButton(scene, item),
        name: item.id,
    });

const resizePanel = (scene, panel) => {
    const grid = panel.getByName("grid", true);
    const gridItems = grid.getElement("items");
    gridItems.forEach(label => scaleButton({ scene, config: scene.config, gelButton: label.children[0] }));
    panel.minHeight = scene.layout.getSafeArea({}, false).height;
    panel.layout();
};

const setupEvents = panel => {
    panel.on("scroll", panel.updatePanelOnScroll);

    const items = panel.getByName("grid", true).getElement("items");
    items.map(item => {
        const a11yElem = item.children[0].accessibleElement.el;
        a11yElem.addEventListener("focus", e => panel.updatePanelOnFocus(item));
    });
};

const updateA11yOffset = (panel, yOffset) => (panel.a11yWrapper.style.top = yOffset + "px");
const updateT = (panel, tDelta) => panel.t += tDelta;


const updatePanelOnScroll = panel => t => {
    if (!panel.a11yWrapper) return;

    if (!panel.a11yWrapper.style.cssText) {
        panel.a11yWrapper.style.position = "absolute";
        panel.a11yWrapper.style.top = "0px";
    }

    const items = getPanelItems(panel);
    const itemHeight = items[0].height;
    const space = panel.space.top;
    const totalItemsHeight = itemHeight * items.length + space * items.length;
    const panelInnerHeight = panel.height - space;
    const yOffset = -(totalItemsHeight - panelInnerHeight) * panel.t * getMetrics().scale;
    updateA11yOffset(panel, yOffset);
};

const updatePanelOnFocus = panel => rexLabel => {
    const visibleBounds = getVisibleRangeBounds(panel);
    const itemBounds = getItemBounds(panel, rexLabel);
    // const offsetFn = (visible, item) => fp.cond([
    //     [(visible, item) => item.lower < visible.lower, () => item.lower - visible.lower],
    //     [(visible, item) => item.upper > visible.upper, () => item.upper - visible.upper], 
    //     [() => true, () => 0],
    // ]);
    // const offset = offsetFn(visibleBounds, itemBounds);
    let offset;
    if (itemBounds.lower < visibleBounds.lower) {
        offset = itemBounds.lower - visibleBounds.lower;
    } else if (itemBounds.upper > visibleBounds.upper) {
        offset = itemBounds.upper - visibleBounds.upper;
    } else {
        offset = 0;
    }
    offset && updatePanelOffset(panel, offset);
};

const updatePanelOffset = (panel, offset) => {
    const visibleWindowHeight = panel.minHeight - panel.space.top * 2;
    const items = getPanelItems(panel);
    const itemsHeight = items.length * (items[0].height + panel.space.top) - panel.space.top;
    const maxOffset = itemsHeight - visibleWindowHeight;
    const tDelta = offset / maxOffset;
    updateT(panel, tDelta);
};

const getVisibleRangeBounds = panel => {
    const items = getPanelItems(panel);
    const itemsHeight = items.length * (items[0].height + panel.space.top);
    const visibleWindowHeight = panel.minHeight - panel.space.top * 2;
    const maxOffset = itemsHeight - visibleWindowHeight;
    const offset = maxOffset * panel.t;
    const lower = offset;
    const upper = itemsHeight - (maxOffset - offset);
    return { lower, upper };
};

const getItemBounds = (panel, rexLabel) => {
    const items = getPanelItems(panel);
    const idx = items.findIndex(item => item === rexLabel);
    const lower = idx * rexLabel.height + idx * panel.space.top;
    const upper = lower + rexLabel.height;
    return { lower, upper };
};

const getPanelItems = panel => panel.getByName("grid", true).getElement("items");

export { scrollableList, resizePanel };
