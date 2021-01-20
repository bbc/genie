/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { updatePanelOnFocus, updatePanelOnScroll } from "./scrollable-list-handlers.js";
import { createGelButton, scaleButton, updateButton, getButtonState } from "./scrollable-list-buttons.js";
import { getPaneBackgroundKey } from "../../../components/shop/shop-layout.js";
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

const getConfig = (scene, title, prepTx, parent) => {
    const { listPadding: space, assetKeys: keys, assetPrefix } = scene.config;
    const safeArea = getPanelY(scene);
    const outer = { x: space.x * space.outerPadFactor, y: space.y * space.outerPadFactor };
    const key = getPaneBackgroundKey(scene, title);
    let backgroundValue;
    if (key == null) {
        const rectangle = scene.add.rectangle(0, 0, 1, 1, 0, 0);
        backgroundValue = rectangle;
    } else {
        backgroundValue = scene.add.image(0, 0, getPaneBackgroundKey(scene, title));
    }
    return {
        y: safeArea.y,
        height: safeArea.height,
        scrollMode: 0,
        background: backgroundValue,
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

        collection.forEach((item, idx) => table.add(createItem(scene, item, title, prepTx), 0, idx, "top", 0, true));

        sizer.add(table, 1, "center", 0, true);
    }

    return sizer;
};

const forwardEventsToButton = (label, button) => {
    label.setInteractive();
    [Phaser.Input.Events.POINTER_UP, Phaser.Input.Events.POINTER_OVER, Phaser.Input.Events.POINTER_OUT].forEach(event =>
        label.on(event, () => button.emit(event, button, button.scene.sys.input.activePointer, false)),
    );
};

const createItem = (scene, item, title, prepTx) => {
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
    forwardEventsToButton(label, icon);
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
    scene.events.once("shutdown", () => scene.scale.removeListener("resize", debouncedResize));

    panel.updateOnScroll = updatePanelOnScroll(panel);
    panel.on("scroll", panel.updateOnScroll);

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
        this.panel = createPanel(scene, title, callback, this);
        this.makeAccessible = fp.noop;

        this.add(this.panel);
        scene.layout.addCustomGroup(scene.scene.key, this, 0);
        a11y.addGroupAt(scene.scene.key, 0);

        scene.input.topOnly = false;
        setupEvents(scene, this.panel);

        this.reset = resizePanel(this.scene, this.panel);
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
            item.config.tabbable = isVisible;
            item.accessibleElement.update();
        });
        isVisible && updatePanel(this.panel);
    }
}
