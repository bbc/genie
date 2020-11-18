/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { setVisible, resize, getHalfRectBounds, getInnerRectBounds, createRect } from "./shop-layout.js";
import { createConfirmButtons } from "./menu-buttons.js";

export const createConfirm = (scene, config, bounds) => {
    const { buttonsRight } = config.menu;
    const { styleDefaults } = config;

    const confirmContainer = scene.add.container();
    const innerBounds = getOffsetBounds(bounds, getInnerRectBounds(bounds, buttonsRight));
    const yOffset = bounds.height / 2 + bounds.y;

    confirmContainer.buttons = createConfirmButtons(scene, innerBounds, config, yOffset); // hard coded value nono

    confirmContainer.add([
        createRect(scene, getHalfRectBounds(bounds, !buttonsRight), 0xff0000),
        createRect(scene, getHalfRectBounds(bounds, buttonsRight), 0xff00ff),
        createRect(scene, innerBounds, 0x0000ff),
        scene.add.text(innerBounds.x, promptY(bounds), config.confirm.prompts.buy, styleDefaults).setOrigin(0.5),
        scene.add.text(innerBounds.x + 20, currencyY(bounds), "1000", styleDefaults).setOrigin(0.5),
        scene.add.image(innerBounds.x - 20, currencyY(bounds), "shop.balanceIcon"),
        ...itemView(scene, undefined, config, bounds),
    ]);

    confirmContainer.setVisible = setVisible(confirmContainer);
    confirmContainer.resize = resize(confirmContainer);

    confirmContainer.setY(yOffset);

    return confirmContainer;
};

const itemView = (scene, item, config, bounds) =>
    config.confirm.detailView
        ? itemDetailView(scene, item, config, bounds)
        : itemImageView(scene, item, config, bounds);

const itemImageView = (scene, item, config, bounds) => {
    const image = scene.add.image(imageX(config, bounds), 0, assetKey(item));
    image.setScale((bounds.width / 2 / image.width) * 0.9);
    return [image];
};

const itemDetailView = (scene, item, config, bounds) => {
    const itemImage = scene.add.image(imageX(config, bounds), imageY(bounds), assetKey(item));
    itemImage.setScale(bounds.height / 3 / itemImage.height);
    const itemTitle = scene.add
        .text(imageX(config, bounds), 0, "Item Default Title", config.styleDefaults)
        .setOrigin(0.5);
    const itemDescription = scene.add
        .text(imageX(config, bounds), descriptionY(bounds), "Item Default Description", config.styleDefaults)
        .setOrigin(0.5);
    return [itemImage, itemTitle, itemDescription];
};

const assetKey = () => "shop.itemIcon";
const imageY = bounds => -bounds.height / 4;
const promptY = outerBounds => -outerBounds.height / 2 + outerBounds.height / 8;
const currencyY = outerBounds => -outerBounds.height / 2 + outerBounds.height / 4;
const descriptionY = bounds => bounds.height / 5;
const getOffsetBounds = (outerBounds, innerBounds) => ({
    ...innerBounds,
    y: innerBounds.y + (outerBounds.height - innerBounds.height) * 0.38,
});
const imageX = (config, bounds) =>
    config.menu.buttonsRight ? bounds.x + bounds.width / 4 : bounds.x + (bounds.width / 4) * 3;
