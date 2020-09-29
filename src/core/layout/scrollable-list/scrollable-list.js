/**

 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

import { accessibilify } from "../../accessibility/accessibilify.js";
import { eventBus } from "../../event-bus.js"

import { GelButton } from "../gel-button.js";

export const scrollableList = (scene, config) => {
    const panelConfig = getConfig(scene, config);
    const panel = scene.rexUI.add.scrollablePanel(panelConfig).layout();
    scene.input.topOnly = false;

    return panel;
};

export const getConfig = (scene, config) => {

    config = {
        space: 10,
        items: [
            { name: "itemOne" }, 
            { name: "itemTwo" },
            { name: "itemThree" },
            { name: "itemFour" },
            { name: "itemFive" },
        ],
    };

    const safeArea = scene.layout.getSafeArea();
    return {
        x: 0, 
        y: 0,
        width: safeArea.width,
        height: safeArea.height,
        scrollMode: 0,
        background: scene.add.image(0, 0, "shop.background"),
        panel: {
            child: createPanel(scene, config),
            mask: {
                padding: 0,
            },
            // background: createBackground(scene, config, safeArea), // maybe only needed for debug
        },
        slider: {
            track: scene.add.image(0, 0, "shop.scrollbar"),
            thumb: scene.add.image(0, 0, "shop.scrollbarHandle"),
        },
        space: {
            left: 0,
            right: config.space,
            top: config.space,
            bottom: config.space,
            panel: 0
        }
    }
};

export const createPanel = (scene, config) => {
    const sizer = scene.rexUI.add.sizer({
        orientation: "x",
        space: { item: 10 },
    }).add(
        createTable(scene, config), 
        { expand: true }
    );
    return sizer;
};

export const createBackground = (scene, config, safeArea) => { // can generalise?
    const background = scene.add.image(-config.space, 0, "shop.panelBackground");
    background.scaleX = (safeArea.width - config.space * 2) / background.width;
    background.scaleY = (safeArea.height - config.space * 2) / background.height;
    return background;
};

export const createTable = (scene, config) => {
    const table = scene.rexUI.add.gridSizer({
        column: 1,
        row: config.items.length,
        space: { column: 10, row: 10 },
        name: "someKey",
    });

    config.items.forEach((item, idx) => {
        table.add(createItem(scene, item, table, config), 0, idx, "top", 0, true);
    });

    return scene.rexUI.add.sizer({
        orientation: "y",
        space: { left: 10, right: 10, top: 0, bottom: 10, item: 10 }
    }).add(
        table, 1, "center", 0, true
    );
};

export const createItem = (scene, item, table, config) => {
    const label = scene.rexUI.add.label({
        orientation: 0,
        icon: createGelButton(scene, item, config),
        name: item.name,
        space: { icon: 3 }
    });
    return label;
};

export const createGelButton = (scene, item, config) => {

    const id = `shop_id_${item.name}`;

    const gelConfig = {
        gameButton: true,
        accessibilityEnabled: true,
        ariaLabel: "someLabel",
        channel: "shop_menu",
        group: "middleCenter",
        id,
        key: "itemBackground",
        scene: "shop",
    };

    const gelButton = scene.add.gelButton(0, 0, gelConfig); // factory might be the problem?
    // const gelButton = new GelButton(scene, 0, 0, gelConfig); // factory might be the problem?
    scaleButton(scene, gelButton, config);
    console.log('BEEBUG: gelButton', gelButton);

    const callback = () => onClick(gelButton);
    eventBus.subscribe({ callback, channel: "shop_menu", name: id });

    return addOverlays(scene, gelButton, item);
};

export const addOverlays = (scene, gelButton, item) => {
    gelButton.overlays.set("background", scene.add.image(0, 0, "shop.itemBackground"));
    gelButton.overlays.set("icon", scene.add.image((-gelButton.width / 2) + 32, 0, "shop.itemIcon")); // hardcoding hacks here hrm.
    gelButton.overlays.set("currencyIcon", scene.add.image((gelButton.width / 2) - 64, 0, "shop.currency"));
    gelButton.overlays.set("currencyAmount", scene.add.text((gelButton.width / 2) - 48, -8, "10"));
    gelButton.overlays.set("itemName", scene.add.text(-gelButton.width / 4, -12, "primary text"));
    gelButton.overlays.set("itemDescription", scene.add.text(-gelButton.width / 4, 0, "secondary text"));
    return gelButton;
}

export const scaleButton = (scene, button, config) => {
    const safeArea = scene.layout.getSafeArea();
    const scaleFactor = (safeArea.width - config.space * 2) / button.width;
    button.setScale(scaleFactor);
};

const onClick = gelButton => {
    console.log(`Clicked ${gelButton.id}`);
}
