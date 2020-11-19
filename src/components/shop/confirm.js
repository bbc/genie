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
    confirmContainer.config = config;
    confirmContainer.memoisedBounds = bounds;

    const innerBounds = getOffsetBounds(bounds, getInnerRectBounds(bounds, buttonsRight));
    const yOffset = bounds.height / 2 + bounds.y;

    confirmContainer.setY(yOffset);
    confirmContainer.buttons = createConfirmButtons(scene, innerBounds, config, yOffset);

    confirmContainer.elems = {
        background: [
            createRect(scene, getHalfRectBounds(bounds, !buttonsRight), 0xff0000),
            createRect(scene, getHalfRectBounds(bounds, buttonsRight), 0xff00ff),
            createRect(scene, innerBounds, 0x0000ff),
        ],
        prompt: scene.add
            .text(innerBounds.x, promptY(bounds), config.confirm.prompts.buy, styleDefaults)
            .setOrigin(0.5),
        price: scene.add.text(innerBounds.x + 20, currencyY(bounds), "1000", styleDefaults).setOrigin(0.5),
        priceIcon: scene.add.image(
            innerBounds.x - 20,
            currencyY(bounds),
            `${config.assetPrefix}.${config.balance.icon.key}`,
        ),
        item: itemView(scene, undefined, config, bounds),
    };

    populate(confirmContainer);

    confirmContainer.setVisible = setVisible(confirmContainer);
    confirmContainer.resize = resize(confirmContainer);
    confirmContainer.update = update(scene, confirmContainer);
    confirmContainer.prepTransaction = prepTransaction(scene, confirmContainer);

    return confirmContainer;
};

const update = (scene, container) => item => {
    // console.log("updating with ", item);
    // needs the prompt too
    container.removeAll(false);
    container.elems.price.setText(item.price);
    container.elems.item = itemView(scene, item, container.config, container.memoisedBounds);
    populate(container);
};

const populate = container =>
    container.add([
        ...container.elems.background,
        container.elems.prompt,
        container.elems.price,
        container.elems.priceIcon,
        ...container.elems.item,
    ]);

const prepTransaction = (scene, container) => item => {
    container.update(item);
    scene.setVisiblePane("confirm");
};

const itemView = (scene, item, config, bounds) =>
    config.confirm.detailView
        ? itemDetailView(scene, item, config, bounds)
        : itemImageView(scene, item, config, bounds);

const itemImageView = (scene, item, config, bounds) => {
    const image = scene.add.image(imageX(config, bounds), 0, assetKey(config, item));
    image.setScale((bounds.width / 2 / image.width) * 0.9);
    return [image];
};

const itemDetailView = (scene, item, config, bounds) => {
    const itemImage = scene.add.image(imageX(config, bounds), imageY(bounds), assetKey(config, item));
    itemImage.setScale(bounds.height / 3 / itemImage.height);
    const itemTitle = scene.add
        .text(imageX(config, bounds), 0, getItemTitle(item), config.styleDefaults)
        .setOrigin(0.5);
    const itemDescription = scene.add
        .text(imageX(config, bounds), descriptionY(bounds), getItemDescription(item), config.styleDefaults)
        .setOrigin(0.5);
    return [itemImage, itemTitle, itemDescription];
};

const getItemTitle = item => (item ? item.title : "Item Default Title");
const getItemDescription = item => (item ? item.description : "Item Default Description");
const assetKey = (config, item) => (item ? `${config.assetPrefix}.${item.icon}` : "shop.itemIcon");
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
