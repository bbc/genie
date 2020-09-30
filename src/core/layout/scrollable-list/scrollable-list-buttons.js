import { onClick } from "./scrollable-list-helpers.js";
import { eventBus } from "../../event-bus.js";
import { assetKey } from "./scrollable-list-helpers.js";

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
        inScrollable: true
    };

    const gelButton = scene.add.gelButton(0, 0, gelConfig);

    eventBus.subscribe({ 
        callback: () => onClick(gelButton), 
        channel: gelConfig.channel, 
        name: id 
    });
    
    scaleButton(scene, gelButton, config);

    return overlays1Wide(scene, gelButton, item, config);
};

export const overlays1Wide = (scene, gelButton, item, config) => {
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
    return button;
};