/**
 * ScrollableList provides a rexUI scrollable panel for listing collections of items, with gel-buttons, states and sizing.
 *
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { updatePanelOnFocus, updatePanelOnWheel } from "./scrollable-list-handlers.js";
import { createListButton, scaleButton } from "./scrollable-list-buttons.js";
import * as a11y from "../../../core/accessibility/accessibility-layer.js";
import { collections } from "../../../core/collections.js";
import { onScaleChange } from "../../../core/scaler.js";
import fp from "../../../../lib/lodash/fp/fp.js";
import { createBackground, resizeBackground } from "../backgrounds.js";
import { createScrollablePanel, getPanelY } from "./scrollable-panel.js";
import { addText } from "../../../core/layout/text.js";
import { createCovers, resizeCovers } from "./scrollable-list-covers.js";

const createTable = (scene, mode, parent, scrollablePanel, collection) => {
    const sizer = scene.rexUI.add.sizer({ orientation: "y" });

    const table = scene.rexUI.add.gridSizer({
        column: 1,
        row: collection.length,
        space: { row: scene.config.listPadding.y },
        name: "grid",
    });

    collection.forEach((item, idx) =>
        table.add(createItem(scene, item, mode, parent, scrollablePanel), 0, idx, "top", 0, true),
    );
    sizer.add(table, 1, "center", 0, true);
    return sizer;
};

const showConfirmation = (scene, mode, item) => {
    scene.transientData.shop.mode = mode;
    scene.transientData.shop.item = item;
    scene.scene.pause();
    scene.addOverlay(scene.scene.key.replace("-list", "-confirm"));
};

const createItem = (scene, item, mode, parent, scrollablePanel) => {
    const action = pointer => {
        const prevType = pointer.screen.input.keyboard.prevType;
        return (
            (scrollablePanel.isInTouching() || !pointer || prevType === "keydown") &&
            !isLocked(item) &&
            showConfirmation(scene, mode, item)
        );
    };
    const icon = createListButton(scene, item, mode, action, parent);

    return scene.rexUI.add.label({
        orientation: 0,
        icon,
        name: item.id,
    });
};

const isLocked = item => item.state === "locked";

const resizePanel = (scene, panel) => () => {
    const t = panel.t;
    const items = getPanelItems(panel);
    items.forEach(label => scaleButton(label.children[0], scene.layout, scene.config.listPadding));
    const safeArea = getPanelY(scene);
    panel.minHeight = safeArea.height;
    panel.y = safeArea.y;
    panel.layout();
    panel.setT(t);
};

const getFirstElement = item => item.children[0]?.accessibleElement?.el;

const setupEvents = (scene, panel) => {
    const items = getPanelItems(panel);
    panel.on("scroll", () =>
        panel.childrenMap.scroller.state === "DRAG"
            ? getPanelItems(panel).forEach(item => item.childrenMap.icon.disableInteractive())
            : getPanelItems(panel).forEach(item => item.childrenMap.icon.setInteractive()),
    );
    scene.input.on(
        "pointerup",
        () =>
            panel.childrenMap.scroller.state === "DRAG" &&
            getPanelItems(panel).forEach(item => item.childrenMap.icon.setInteractive()),
    );

    const scaleEvent = onScaleChange.add(resizePanel(scene, panel));
    scene.events.once("shutdown", scaleEvent.unsubscribe);

    const debouncedResize = fp.debounce(10, resizePanel(scene, panel));
    scene.scale.on("resize", debouncedResize, scene);

    const onMouseWheelListener = updatePanelOnWheel(panel);
    scene.input.on("gameobjectwheel", onMouseWheelListener);

    scene.events.once("shutdown", () => {
        scene.scale.removeListener("resize", debouncedResize);
        scene.input.removeListener("gameobjectwheel", onMouseWheelListener);
    });

    panel.updateOnFocus = updatePanelOnFocus(panel);
    items.forEach(item => getFirstElement(item).addEventListener("focus", () => panel.updateOnFocus(item)));
};

const getPanelItems = panel => panel.getByName("grid", true)?.getElement("items");

const getFilteredCollection = (collection, filter) => {
    const baseCollection = filter ? collection.filter(filter) : collection;
    return baseCollection.filter(removeZeroQty);
};

const removeZeroQty = item => item.slot || item.qty > 0;

const getTextOffset = position => {
    if (!position) return { x: 0, y: 0 };
    return { x: position.offsetX, y: position.offsetY };
};

const createEmptyText = (scene, mode) => {
    const config = scene.config.emptyList?.[mode];
    const emptyText = addText(scene, 0, 0, config?.value || "No items", config);
    const offset = getTextOffset(config?.position, emptyText);
    emptyText.setOrigin(0.5, 0.5).setPosition(offset.x, offset.y);
    return emptyText;
};

export class ScrollableList extends Phaser.GameObjects.Container {
    constructor(scene, mode, filter) {
        super(scene, 0, 0);

        const config = scene.config.backgrounds?.[mode] ?? null;
        this.background = createBackground(scene, config);

        a11y.addGroupAt(scene.scene.key, 0);
        const key = scene.transientData.shop.config.shopCollections[mode];

        const collection = getFilteredCollection(collections.get(key).getAll(), filter);
        if (collection.length) {
            const { scrollablePanel, child } = createScrollablePanel(scene, mode, this);
            this.panelChild = child;
            this.add(scrollablePanel);
            scene.layout.addCustomGroup(scene.scene.key, scrollablePanel, 0);
            child.add(createTable(scene, mode, this, scrollablePanel, collection), { expand: true });
            setupEvents(scene, scrollablePanel);

            this.coversConfig = { ...scene.config.listCovers?.[mode], ...scene.config.listPadding };
            this.covers = createCovers(scene, this.coversConfig);

            this.reset = () => {
                resizePanel(scene, scrollablePanel)();
                this.resetBackground();
            };
        } else {
            createEmptyText(scene, mode);
            this.reset = () => this.resetBackground();
        }

        scene.input.topOnly = false;
    }

    resetBackground() {
        resizeBackground(this.background.constructor)(this.scene, this.background);
        resizeCovers(this.scene, this.panelChild, this.covers, this.coversConfig);
    }

    getBoundingRect() {
        return this.scene.layout.getSafeArea({}, false);
    }
}
