/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { updatePanelOnFocus, updatePanelOnScroll } from "./scrollable-list-handlers.js";
import { createGelButton, scaleButton } from "./scrollable-list-buttons.js";
import * as a11y from "../../accessibility/accessibility-layer.js";
import fp from "../../../../lib/lodash/fp/fp.js";

const GRID_NAME = "grid";

const scrollableList = scene => {
    const scrollableListPanel = createScrollableListPanel(scene);
    scene.panel = scrollableListPanel;
    scene.input.topOnly = false;
    setupEvents(scene, scrollableListPanel);
    setupAccessibility(scene, scrollableListPanel);

    return scrollableListPanel;
};

const createScrollableListPanel = scene => {
    const panelConfig = getPanelConfig(scene);
    const panel = scene.rexUI.add.scrollablePanel(panelConfig);
    panel.layout();
    return panel;
};

const getPanelConfig = scene => {
    const { space, assetKeys: keys } = scene.config;
    const safeArea = getPanelY(scene);
    return {
        y: safeArea.y,
        height: safeArea.height,
        scrollMode: 0,
        background: scene.add.image(0, 0, `${keys.prefix}.${keys.background}`),
        panel: { child: createInnerPanel(scene) },
        slider: {
            track: scene.add.image(0, 0, `${keys.prefix}.${keys.scrollbar}`),
            thumb: scene.add.image(0, 0, `${keys.prefix}.${keys.scrollbarHandle}`),
            width: space,
        },
        space: { left: space, right: space, top: space, bottom: space, panel: space },
    };
};

const getPanelY = scene => {
    const safeArea = scene.layout.getSafeArea({}, false);
    return { y: safeArea.height / 2 + safeArea.y, height: safeArea.height };
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
        name: GRID_NAME,
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
    const t = panel.t;
    const items = panel.getByName(GRID_NAME, true).getElement("items");
    items.forEach(label => scaleButton({ scene, config: scene.config, gelButton: label.children[0] }));
    const safeArea = getPanelY(scene);
    panel.minHeight = safeArea.height;
    panel.y = safeArea.y;
    panel.layout();
    panel.setT(t);
};

const setupEvents = (scene, panel) => {
    scene.scale.on(
        "resize",
        fp.debounce(10, () => resizePanel(scene, panel)),
        scene,
    );

    panel.updateOnScroll = updatePanelOnScroll(panel);
    panel.on("scroll", panel.updateOnScroll);

    panel.updateOnFocus = updatePanelOnFocus(panel);
    const items = panel.getByName(GRID_NAME, true).getElement("items");
    items.map(item => {
        const a11yElem = item.children[0].accessibleElement.el;
        a11yElem.addEventListener("focus", () => panel.updateOnFocus(item));
    });
};

const setupAccessibility = (scene, panel) => {
    const a11yGroup = scene.add.container();
    a11yGroup.reset = () => resizePanel(scene, panel);
    a11yGroup.add(panel);

    scene.layout.addCustomGroup(scene.scene.key, a11yGroup, 0);
    a11y.addGroupAt(scene.scene.key, 0);
};

export { scrollableList, resizePanel };
