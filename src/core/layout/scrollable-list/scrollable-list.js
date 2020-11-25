/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { updatePanelOnFocus, updatePanelOnScroll } from "./scrollable-list-handlers.js";
import { createGelButton, scaleButton, updateButton, getState } from "./scrollable-list-buttons.js";
import * as a11y from "../../accessibility/accessibility-layer.js";
import { collections } from "../../collections.js";
import { onScaleChange } from "../../scaler.js";
import fp from "../../../../lib/lodash/fp/fp.js";

const createPanel = (scene, title, prepTx) => {
    const panel = scene.rexUI.add.scrollablePanel(getConfig(scene, title, prepTx));
    panel.layout();
    return panel;
};

const getConfig = (scene, title, prepTx) => {
    const { listPadding: space, assetKeys: keys, assetPrefix } = scene.config;
    const safeArea = getPanelY(scene);
    return {
        y: safeArea.y,
        height: safeArea.height,
        scrollMode: 0,
        background: scene.add.image(0, 0, `${assetPrefix}.${keys.background}`),
        panel: { child: createInnerPanel(scene, title, prepTx) },
        slider: {
            track: scene.add.image(0, 0, `${assetPrefix}.${keys.scrollbar}`),
            thumb: scene.add.image(0, 0, `${assetPrefix}.${keys.scrollbarHandle}`),
            width: space.x,
        },
        space: { left: space.x, right: space.x, top: space.y, bottom: space.y, panel: space.x },
    };
};

const getPanelY = scene => {
    const safeArea = scene.layout.getSafeArea({}, false);
    return { y: safeArea.height / 2 + safeArea.y, height: safeArea.height };
};

const createInnerPanel = (scene, title, prepTx) => {
    const sizer = scene.rexUI.add.sizer({ orientation: "x", space: { item: 0 } });
    sizer.add(createTable(scene, title, prepTx), { expand: true });
    return sizer;
};

const createTable = (scene, title, prepTx) => {
    const key = scene.config.paneCollections[title];
    const collection = collections.get(key).getAll();

    const table = scene.rexUI.add.gridSizer({
        column: 1,
        row: collection.length,
        space: { row: scene.config.listPadding.y },
        name: "grid",
    });

    collection.forEach((item, idx) => table.add(createItem(scene, item, title, prepTx), 0, idx, "top", 0, true));

    return scene.rexUI.add.sizer({ orientation: "y" }).add(table, 1, "center", 0, true);
};

const createItem = (scene, item, title, prepTx) =>
    scene.rexUI.add.label({
        orientation: 0,
        icon: createGelButton(scene, item, title, getState(item, title), prepTx), // here's where we need to provide the launch state.
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
    const scaleEvent = onScaleChange.add(() => resizePanel(scene, panel));
    scene.events.once("shutdown", scaleEvent.unsubscribe);

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

const updatePanel = panel => getPanelItems(panel).forEach(item => updateButton(item.children[0]));

const getPanelItems = panel => panel.getByName("grid", true).getElement("items");

export class ScrollableList extends Phaser.GameObjects.Container {
    constructor(scene, title, prepTransaction) {
        super(scene, 0, 0);
        this.panel = createPanel(scene, title, prepTransaction);
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
        isVisible && updatePanel(this.panel);
    }
}
