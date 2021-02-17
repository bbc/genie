/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { updatePanelOnFocus, updatePanelOnScroll, updatePanelOnWheel } from "./scrollable-list-handlers.js";
import { createGelButton, scaleButton, updateButton } from "./scrollable-list-buttons.js";
import { createConfirm } from "../confirm.js";
import * as a11y from "../../../core/accessibility/accessibility-layer.js";
import { collections } from "../../../core/collections.js";
import { onScaleChange } from "../../../core/scaler.js";
import fp from "../../../../lib/lodash/fp/fp.js";
import { accessibilify } from "../../../core/accessibility/accessibilify.js";
import { createBackground, resizeBackground } from "./backgrounds.js";

const createPanel = (scene, title, parent) => {
    const panel = scene.rexUI.add.scrollablePanel(getConfig(scene, title, parent));
    panel.name = title;
    panel.layout();

    return panel;
};

export const getType = value => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();

const getConfig = (scene, title, parent) => {
    const { listPadding: space } = scene.config;
    const safeArea = getPanelY(scene);
    const outer = { x: space.x * space.outerPadFactor, y: space.y * space.outerPadFactor };

    return {
        y: safeArea.y,
        height: safeArea.height,
        scrollMode: 0,
        panel: { child: createInnerPanel(scene, title, parent) },
        slider: {
            track: scene.add.image(0, 0, `${scene.assetPrefix}.scrollbar`),
            thumb: scene.add.image(0, 0, `${scene.assetPrefix}.scrollbarHandle`),
            width: space.x,
        },
        space: { left: outer.x, right: outer.x, top: outer.y, bottom: outer.y, panel: space.x },
    };
};

const getPanelY = scene => {
    const safeArea = scene.layout.getSafeArea({}, false);
    return { y: safeArea.height / 2 + safeArea.y, height: safeArea.height };
};

const createInnerPanel = (scene, title, parent) => {
    const sizer = scene.rexUI.add.sizer({ orientation: "x", space: { item: 0 }, name: "gridContainer" });
    sizer.add(createTable(scene, title, parent), { expand: true });
    return sizer;
};

const createTable = (scene, title, parent) => {
    const key = scene.config.paneCollections[title];
    const collection = getFilteredCollection(collections.get(key).getAll(), parent.collectionFilter);

    const sizer = scene.rexUI.add.sizer({ orientation: "y" });

    if (collection.length) {
        const table = scene.rexUI.add.gridSizer({
            column: 1,
            row: collection.length,
            space: { row: scene.config.listPadding.y },
            name: "grid",
        });

        collection.forEach((item, idx) => table.add(createItem(scene, item, title, parent), 0, idx, "top", 0, true));
        sizer.add(table, 1, "center", 0, true);
    }

    return sizer;
};

const showConfirmation = (scene, title, item) => {
    scene.panes.confirm = createConfirm(scene, title, item);
    scene.stack("confirm");
};

const createItem = (scene, item, title, parent) => {
    const icon = createGelButton(scene, item, title);
    const isLocked = isItemLocked(item);
    const label = scene.rexUI.add.label({
        orientation: 0,
        icon,
        name: item.id,
    });
    label.config = {
        id: `scroll_button_${item.id}_${title}`,
        ariaLabel: `${item.title} - ${item.description}`,
    };
    const callback = pointer =>
        (parent.panel.isInTouching() || !pointer) && !isLocked && showConfirmation(scene, title, item);
    label.setInteractive();
    label.on(Phaser.Input.Events.POINTER_UP, callback);
    scene.events.once("shutdown", () => label.off(Phaser.Input.Events.POINTER_UP, callback));
    accessibilify(label);
    return label;
};

const isItemLocked = item => item.state === "locked";

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

const getFirstElement = item => item.accessibleElement?.el;

const setupEvents = (scene, panel) => {
    const scaleEvent = onScaleChange.add(resizePanel(scene, panel));
    scene.events.once("shutdown", scaleEvent.unsubscribe);

    const debouncedResize = fp.debounce(10, resizePanel(scene, panel));
    scene.scale.on("resize", debouncedResize, scene);

    panel.updateOnScroll = updatePanelOnScroll(panel);
    panel.on("scroll", panel.updateOnScroll);

    const onMouseWheelListener = updatePanelOnWheel(panel);
    scene.input.on("gameobjectwheel", onMouseWheelListener);

    scene.events.once("shutdown", () => {
        scene.scale.removeListener("resize", debouncedResize);
        scene.input.removeListener("gameobjectwheel", onMouseWheelListener);
    });

    panel.updateOnFocus = updatePanelOnFocus(panel);
    const items = getPanelItems(panel);

    items.forEach(item => getFirstElement(item).addEventListener("focus", () => panel.updateOnFocus(item)));
};

const updatePanel = panel => {
    const parent = panel.parentContainer;
    const key = parent.scene.config.paneCollections[panel.name];
    const collection = getFilteredCollection(collections.get(key).getAll(), parent.collectionFilter);
    const items = getPanelItems(panel);
    parent.scene.title.setTitleText(panel.name);

    shouldPanelListUpdate(collection, items)
        ? updatePanelList(panel)
        : items.forEach(item => updateButton(item.children[0]));
};

const shouldPanelListUpdate = (collection, items) =>
    collection.length !== items.length || items.some((item, idx) => item.children[0].item.id !== collection[idx].id);

const updatePanelList = panel => {
    const tableContainer = panel.getByName("gridContainer", true);
    const scene = panel.parentContainer.scene;
    tableContainer.clear(true);
    tableContainer.add(createTable(scene, panel.name, panel.parentContainer));
    resizePanel(scene, panel)();
};

const getPanelItems = panel => panel.getByName("grid", true)?.getElement("items") ?? [];

const getFilteredCollection = (collection, filter) => {
    const baseCollection = filter ? collection.filter(filter) : collection;
    return baseCollection.filter(removeZeroQty);
};

const removeZeroQty = item => item.slot || item.qty > 0;

export class ScrollableList extends Phaser.GameObjects.Container {
    constructor(scene, title, filter) {
        super(scene, 0, 0);
        this.collectionFilter = filter;

        const config = scene.config.backgrounds?.[title] ?? null;
        this.background = createBackground[getType(config)](scene, config);
        this.panel = createPanel(scene, title, this);
        this.makeAccessible = fp.noop;

        this.add(this.panel);
        scene.layout.addCustomGroup(scene.scene.key, this, 0);
        a11y.addGroupAt(scene.scene.key, 0);

        scene.input.topOnly = false;
        setupEvents(scene, this.panel);

        this.reset = () => {
            resizePanel(scene, this.panel)();
            resizeBackground[this.background.constructor.name](scene, this.background);
        };
    }

    getBoundingRect() {
        return this.scene.layout.getSafeArea({}, false);
    }

    setVisible(isVisible) {
        this.panel.visible = isVisible;
        this.background.visible = isVisible;
        const items = getPanelItems(this.panel);
        items.forEach(item => {
            const button = item.children[0];
            button.input.enabled = isVisible;
            item.config.tabbable = isVisible;
            item.accessibleElement.update();
        });
        isVisible && updatePanel(this.panel);
    }
}
