/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { updatePanelOnFocus, updatePanelOnScroll, updatePanelOnWheel } from "./scrollable-list-handlers.js";
import { createGelButton, scaleButton, updateButton, getButtonState } from "./scrollable-list-buttons.js";
import * as a11y from "../../accessibility/accessibility-layer.js";
import { collections } from "../../collections.js";
import { onScaleChange } from "../../scaler.js";
import fp from "../../../../lib/lodash/fp/fp.js";
import { accessibilify } from "../../accessibility/accessibilify.js";

const createPanel = (scene, title, prepTx, parent) => {
    const panel = scene.rexUI.add.scrollablePanel(getConfig(scene, title, prepTx, parent));
    panel.name = title;
    panel.callback = prepTx;
    panel.layout();

    return panel;
};

export const getType = value => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
const nullToUndefined = val => val === null? undefined : val;


export const createBackground = {
    string: (scene, config) => {
        const background = scene.add.image(0, 0, `${scene.assetPrefix}.${config}`);
        const safeArea = scene.layout.getSafeArea({}, false);

        debugger
        background.setScale(safeArea.width / background.width, safeArea.height / background.height);
        return background;
    },
    null: () => {},
    object: (scene, config) => {
        const { width, height, x, y } = scene.layout.getSafeArea({}, false);
        return scene.add.rexNinePatch({
            x: width / 2 + x,
            y: height / 2 + y,
            width,
            height,
            key: `${scene.assetPrefix}.${config.key}`,
            columns: config.columns.map(nullToUndefined),
            rows: config.rows.map(nullToUndefined),
        });
    },
};

export const resizeBackground = {
    Image: (background, scene) => {
        const safeArea = getPanelY(scene);
        background.setScale(safeArea.width / background.width, safeArea.height / background.height);
    },
    null: () => {},
    NinePatch: (background, scene) => {
        const { width, height, x, y } = scene.layout.getSafeArea({}, false);

        console.log([width, height, x, y])

        background.x = width / 2 + x;
        background.y = height / 2 + y;
        background.resize(width, height);
    },
};

const getConfig = (scene, title, prepTx, parent) => {
    const { listPadding: space, assetKeys: keys, assetPrefix } = scene.config;
    const safeArea = getPanelY(scene);
    const outer = { x: space.x * space.outerPadFactor, y: space.y * space.outerPadFactor };

    return {
        y: safeArea.y,
        height: safeArea.height,
        scrollMode: 0,
        panel: { child: createInnerPanel(scene, title, prepTx, parent) },
        slider: {
            track: scene.add.image(0, 0, `${assetPrefix}.${keys.scrollbar}`),
            thumb: scene.add.image(0, 0, `${assetPrefix}.${keys.scrollbarHandle}`),
            width: space.x,
        },
        space: { left: outer.x, right: outer.x, top: outer.y, bottom: outer.y, panel: space.x },
    };
};

const getPanelY = scene => {
    const safeArea = scene.layout.getSafeArea({}, false);
    return { y: safeArea.height / 2 + safeArea.y, height: safeArea.height };
};

const createInnerPanel = (scene, title, prepTx, parent) => {
    const sizer = scene.rexUI.add.sizer({ orientation: "x", space: { item: 0 }, name: "gridContainer" });
    sizer.add(createTable(scene, title, prepTx, parent), { expand: true });
    return sizer;
};

const createTable = (scene, title, prepTx, parent) => {
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

        collection.forEach((item, idx) =>
            table.add(createItem(scene, item, title, prepTx, parent), 0, idx, "top", 0, true),
        );

        sizer.add(table, 1, "center", 0, true);
    }

    return sizer;
};

const createItem = (scene, item, title, prepTx, parent) => {
    const icon = createGelButton(scene, item, title, getButtonState(item, title), prepTx);
    const label = scene.rexUI.add.label({
        orientation: 0,
        icon,
        name: item.id,
    });
    label.config = {
        id: `scroll_button_${item.id}_${title}`,
        ariaLabel: `${item.title} - ${item.description}`,
    };
    const callback = pointer => (parent.panel.isInTouching() || !pointer) && prepTx(item, title);
    label.setInteractive();
    label.on(Phaser.Input.Events.POINTER_UP, callback);
    scene.events.once("shutdown", () => label.off(Phaser.Input.Events.POINTER_UP, callback));
    accessibilify(label);
    return label;
};

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

const getFirstElement = item => item.accessibleElement.el;

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
    tableContainer.add(createTable(scene, panel.name, panel.callback, panel.parentContainer));
    resizePanel(scene, panel)();
};

const getPanelItems = panel => panel.getByName("grid", true)?.getElement("items") ?? [];

const getFilteredCollection = (collection, filter) => (filter ? collection.filter(filter) : collection);

export class ScrollableList extends Phaser.GameObjects.Container {
    constructor(scene, title, callback, filter) {
        super(scene, 0, 0);
        this.collectionFilter = filter;

        const config = scene.config.backgrounds?.[title] ?? null;
        this.background = createBackground[getType(config)](scene, config);
        this.title = title; //TODO remove, used during debug
        this.panel = createPanel(scene, title, callback, this);
        this.makeAccessible = fp.noop;

        this.add(this.panel);
        scene.layout.addCustomGroup(scene.scene.key, this, 0);
        a11y.addGroupAt(scene.scene.key, 0);

        scene.input.topOnly = false;
        setupEvents(scene, this.panel);

        this.reset = () => {
            resizePanel(scene, this.panel);
            console.log(this.background.constructor.name);

            resizeBackground[this.background.constructor.name](this.background, scene);
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
