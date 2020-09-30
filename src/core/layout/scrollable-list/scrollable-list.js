/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { eventBus } from "../../event-bus.js"

export const scrollableList = (scene, config) => {
    const panelConfig = getPanelConfig(scene, config);
    const panel = scene.rexUI.add.scrollablePanel(panelConfig).layout();
    scene.input.topOnly = false;
    return panel;
};

export const getPanelConfig = scene => {
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
            child: createPanel(scene, config),
            mask: {
                padding: 0,
            },
            // background: createBackground(scene, config, safeArea), // maybe only needed for debug
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
            panel: 0
        }
    }
};

export const createPanel = (scene, config) => {
    const sizer = scene.rexUI.add.sizer({
        orientation: "x",
        space: { item: 0 },
    }).add(
        createTable(scene, config), 
        { expand: true }
    );
    return sizer;
};

export const createBackground = (scene, config, safeArea) => {
    const background = scene.add.image(-config.space, 0, config.assetKeys.panelBackground);
    background.scaleX = (safeArea.width - config.space * 2) / background.width;
    background.scaleY = (safeArea.height - config.space * 2) / background.height;
    return background;
};

export const createTable = (scene, config) => {
    const table = scene.rexUI.add.gridSizer({
        column: 1,
        row: config.items.length,
        space: { column: 10, row: 10 },
    });

    config.items.forEach((item, idx) => {
        table.add(createItem(scene, item, config), 0, idx, "top", 0, true);
    });

    return scene.rexUI.add.sizer({
        orientation: "y",
        space: { left: 10, right: 10, top: 0, bottom: 10, item: 10 }
    }).add(
        table, 1, "center", 0, true
    );
};

export const createItem = (scene, item, config) => {
    const label = scene.rexUI.add.label({
        orientation: 0,
        icon: createGelButton(scene, item, config),
        name: item.name,
        space: { icon: 3 }
    });
    return label;
};

export const createGelButton = (scene, item, config) => {

    const id = `shop_id_${item.id}`;

    const gelConfig = {
        gameButton: true,
        accessibilityEnabled: true,
        ariaLabel: item.ariaLabel, 
        channel: config.eventChannel,
        group: "middleCenter",
        id,
        key: config.assetKeys.itemBackground,
        scene: config.assetKeys.prefix,
    };

    const gelButton = scene.add.gelButton(0, 0, gelConfig);

    const callback = () => onClick(gelButton);
    eventBus.subscribe({ callback, channel: gelConfig.channel, name: id });
    
    scaleButton(scene, gelButton, config);
    return addOverlays(scene, gelButton, item, config);
};

export const addOverlays = (scene, gelButton, item, config) => {
    const { offset, assetKeys: keys, font } = config;
    const edge = gelButton.width / 2;
    gelButton.overlays.set("background", scene.add.image(0, 0, assetKey(keys.itemBackground, keys)));
    gelButton.overlays.set("icon", scene.add.image(-edge + offset.itemIconX, 0, item.icon));
    gelButton.overlays.set("currencyIcon", scene.add.image(edge - offset.currencyIconX, 0, assetKey(keys.currency, keys)));

    const fontStyle = { fontFamily: font.fontFamily, resolution: font.resolution };
    gelButton.overlays.set("currencyAmount", scene.add.text(edge - offset.currencyTextX, -10, item.price, fontStyle));
    const nameY = item.description ? offset.textY * 2 : offset.textY;
    gelButton.overlays.set("itemName", scene.add.text(-edge + offset.textX, -nameY, item.name, { ...fontStyle, fontSize: 20 }));
    gelButton.overlays.set("itemDescription", scene.add.text(-edge + offset.textX, 0, item.description ,fontStyle));

    return gelButton;
}

export const scaleButton = (scene, button, config) => {
    const safeArea = scene.layout.getSafeArea();
    const scaleFactor = (safeArea.width - config.space * 2) / button.width;
    button.setScale(scaleFactor);
};

const onClick = gelButton => {
    console.log(`Clicked ${gelButton.config.id}`);
}

const assetKey = (key, assetKeys) => {
    return [assetKeys.prefix, key].join(".");
}
