/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { updatePanelOnFocus, updatePanelOnScroll } from "./scrollable-list-handlers.js";
import { createGelButton, scaleButton } from "./scrollable-list-buttons.js";
import fp from "../../../../lib/lodash/fp/fp.js";
import * as a11y from "../../accessibility/accessibility-layer.js";

const GRID_NAME = "grid";

const scrollableList = scene => {
    const scrollableListPanel = createScrollableListPanel(scene);
    scene.input.topOnly = false;
    scene.scale.on(
        "resize",
        fp.debounce(100, () => resizePanel(scene, scrollableListPanel)),
        scene,
    );
    setupEvents(scrollableListPanel);
    return scrollableListPanel;
};

const createScrollableListPanel = scene => {
    a11y.addGroupAt("shop", 0); // param this
    const panelConfig = getPanelConfig(scene);
    const panel = scene.rexUI.add.scrollablePanel(panelConfig);
    panel.a11yWrapper = document.getElementById("accessible-group-shop"); // and this
    panel.updateOnFocus = updatePanelOnFocus(panel);
    panel.updateOnScroll = updatePanelOnScroll(panel);
    panel.updateOnScroll(0);
    panel.layout();
    return panel;
};

const getPanelConfig = scene => {
    const config = scene.config;
    const { assetKeys: keys } = config;
    const safeArea = scene.layout.getSafeArea({}, false);
    console.log('BEEBUG: safeArea', safeArea);
    const y = safeArea.height / 2 + safeArea.y;
    return {
        y,
        height: safeArea.height,
        scrollMode: 0,
        background: scene.add.image(0, 0, assetKey(keys.background, keys)),
        panel: { child: createInnerPanel(scene) },
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

const createInnerPanel = scene => {
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
    const grid = panel.getByName(GRID_NAME, true);
    const gridItems = grid.getElement("items");
    gridItems.forEach(label => scaleButton({ scene, config: scene.config, gelButton: label.children[0] }));
    panel.minHeight = scene.layout.getSafeArea({}, false).height;
    panel.layout();
};

const setupEvents = panel => {
    panel.on("scroll", panel.updateOnScroll);

    const items = panel.getByName(GRID_NAME, true).getElement("items");
    items.map(item => {
        const a11yElem = item.children[0].accessibleElement.el;
        a11yElem.addEventListener("focus", e => panel.updateOnFocus(item));
    });
};

const assetKey = (key, assetKeys) => [assetKeys.prefix, key].join(".");

export { scrollableList, resizePanel };
