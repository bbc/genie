import { assetKey } from "./scrollable-list-helpers.js";

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