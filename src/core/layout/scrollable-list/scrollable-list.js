/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { assetKey } from "./scrollable-list-helpers.js";
import { createGelButton } from "./scrollable-list-buttons.js";

export const scrollableList = scene => {
    const panelConfig = getPanelConfig(scene);
    const scrollableListPanel = scene.rexUI.add.scrollablePanel(panelConfig).layout();
    scene.input.topOnly = false;
    return scrollableListPanel;
};

const getPanelConfig = scene => {
    const config = scene.config;
    const { assetKeys: keys } = config;
    const safeArea = scene.layout.getSafeArea();

    return {
        x: 0,
        y: 0,
        width: safeArea.width,
        height: safeArea.height,
        scrollMode: 0,
        background: scene.add.image(0, 0, assetKey(keys.background, keys)),
        panel: {
            child: createPanel(scene),
        },
        slider: {
            track: scene.add.image(0, 0, assetKey(keys.scrollbar, keys)),
            thumb: scene.add.image(0, 0, assetKey(keys.scrollbarHandle, keys)),
        },
        space: {
            left: 0,
            right: config.space,
            top: config.space,
            bottom: config.space,
            panel: 0,
        },
    };
};

const createPanel = scene => {
    const sizer = scene.rexUI.add
        .sizer({
            orientation: "x",
            space: { item: 0 },
        })
        .add(createTable(scene), { expand: true });
    return sizer;
};

const createTable = scene => {
    const table = scene.rexUI.add.gridSizer({
        column: 1,
        row: scene.config.items.length,
        space: { column: 10, row: 10 },
    });

    scene.config.items.forEach((item, idx) => {
        table.add(createItem(scene, item), 0, idx, "top", 0, true);
    });

    return scene.rexUI.add
        .sizer({
            orientation: "y",
            space: { left: 10, right: 10, top: 0, bottom: 10, item: 10 },
        })
        .add(table, 1, "center", 0, true);
};

const createItem = (scene, item) => {
    const label = scene.rexUI.add.label({
        orientation: 0,
        icon: createGelButton(scene, item),
        name: item.name,
        space: { icon: 3 },
    });
    return label;
};

// export const lib = {
//     scrollableList,
//     getPanelConfig,
//     createPanel,
//     createTable,
//     createItem,
// };
