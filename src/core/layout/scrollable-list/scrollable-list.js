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

const createPanel = (scene, context) => {
    const panelConfig = getPanelConfig(scene, context);
    const panel = scene.rexUI.add.scrollablePanel(panelConfig);
    panel.layout();
    return panel;
};

const getPanelConfig = (scene, context) => {
    const { listPadding: space, assetKeys: keys } = scene.config;
    const safeArea = getPanelY(scene);
    return {
        y: safeArea.y,
        height: safeArea.height,
        scrollMode: 0,
        background: scene.add.image(0, 0, `${keys.prefix}.${keys.background}`),
        panel: { child: createInnerPanel(scene, context) },
        slider: {
            track: scene.add.image(0, 0, `${keys.prefix}.${keys.scrollbar}`),
            thumb: scene.add.image(0, 0, `${keys.prefix}.${keys.scrollbarHandle}`),
            width: space.x,
        },
        space: { left: space.x, right: space.x, top: space.y, bottom: space.y, panel: space.x },
    };
};

const getPanelY = scene => {
    const safeArea = scene.layout.getSafeArea({}, false);
    return { y: safeArea.height / 2 + safeArea.y, height: safeArea.height };
};

const createInnerPanel = (scene, context) => {
    const sizer = scene.rexUI.add.sizer({ orientation: "x", space: { item: 0 } });
    sizer.add(createTable(scene, context), { expand: true });
    return sizer;
};

const createTable = (scene, context) => {
    const table = scene.rexUI.add.gridSizer({
        column: 1,
        row: scene.config.items.length,
        space: { row: scene.config.listPadding.y },
        name: "grid",
    });

    scene.config.items.forEach((item, idx) => {
        table.add(createItem(scene, item, context), 0, idx, "top", 0, true);
    });

    return scene.rexUI.add.sizer({ orientation: "y" }).add(table, 1, "center", 0, true);
};

const createItem = (scene, item, context) =>
    scene.rexUI.add.label({
        orientation: 0,
        icon: createGelButton(scene, item, context),
        name: item.id,
    });

const resizePanel = (scene, panel) => {
    const t = panel.t;
    const items = getPanelItems(panel);
    items.forEach(label => scaleButton(label.children[0], scene.layout, panel.space.left));
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
    const items = getPanelItems(panel);
    items.forEach(item => {
        const a11yElem = item.children[0].accessibleElement.el;
        a11yElem.addEventListener("focus", () => panel.updateOnFocus(item));
    });
};

const getPanelItems = panel => panel.getByName("grid", true).getElement("items");

export class ScrollableList extends Phaser.GameObjects.Container {
    constructor(scene, context) {
        super(scene, 0, 0);
        this.panel = createPanel(scene, context);
        this.makeAccessible = fp.noop;

        this.add(this.panel);
        scene.layout.addCustomGroup(scene.scene.key, this, 0);
        a11y.addGroupAt(scene.scene.key, 0);

        scene.input.topOnly = false;
        setupEvents(scene, this.panel);
    }

    reset() {
        resizePanel(this.scene, this.panel);
    }

    getBoundingRect() {
        return this.scene.layout.getSafeArea({}, false);
    }

    setVisible(isVisible) {
        this.panel.visible = isVisible;
        const items = getPanelItems(this.panel);
        items.forEach(item => {
            const button = item.children[0];
            button.input.enabled = isVisible;
            button.accessibleElement.update();
        });
    }
}
