/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { setVisible, resize, getHalfRectBounds, getInnerRectBounds, createRect } from "./shop-layout.js";
import { createConfirmButtons } from "./menu-buttons.js";
import { doTransaction } from "./transact.js";

export const createConfirm = (scene, config, bounds, balance) => {
    const { buttonsRight } = config.menu;
    const { styleDefaults } = config;

    const confirmContainer = scene.add.container();
    confirmContainer.config = config;
    confirmContainer.memoisedBounds = bounds;

    const innerBounds = getOffsetBounds(bounds, getInnerRectBounds(bounds, buttonsRight));
    const yOffset = bounds.height / 2 + bounds.y;

    confirmContainer.setY(yOffset);
    confirmContainer.handleClick = handleClick(scene, confirmContainer);
    confirmContainer.buttons = createConfirmButtons(scene, innerBounds, config, yOffset, confirmContainer.handleClick);

    confirmContainer.elems = {
        background: [
            createRect(scene, getHalfRectBounds(bounds, !buttonsRight), 0xff0000),
            createRect(scene, getHalfRectBounds(bounds, buttonsRight), 0xff00ff),
            createRect(scene, innerBounds, 0x0000ff),
        ],
        prompt: scene.add
            .text(innerBounds.x, promptY(bounds), config.confirm.prompts.shop, styleDefaults)
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
    confirmContainer.doTransaction = doTransaction(scene);
    confirmContainer.setBalance = bal => balance.setText(bal);
    confirmContainer.getBalance = () => balance.getValue();

    return confirmContainer;
};

const handleClick = (scene, container) => button => {
    const cost = button === "Confirm" && confirm(container);
    cost && container.setBalance(container.getBalance() - cost);
    scene.back();
};

const confirm = container => container.transaction && container.doTransaction(container.transaction);

const update = (scene, container) => (item, title) => {
    container.removeAll(false);
    container.elems.prompt.setText(container.config.confirm.prompts[title]);
    container.elems.priceIcon.setVisible(title === "shop");
    container.elems.price.setText(title === "shop" ? item.price : "");
    container.elems.item = itemView(scene, item, container.config, container.memoisedBounds);
    container.transaction = { item, title };
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

const prepTransaction = (scene, container) => (item, title) => {
    container.update(item, title);
    scene.stack("confirm");
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
    const x = imageX(config, bounds);
    const itemImage = scene.add.image(x, imageY(bounds), assetKey(config, item));
    itemImage.setScale(bounds.height / 3 / itemImage.height);
    const itemTitle = scene.add.text(x, 0, getItemTitle(item), config.styleDefaults).setOrigin(0.5);
    const itemDescription = scene.add
        .text(x, descriptionY(bounds), getItemDescription(item), config.styleDefaults)
        .setOrigin(0.5);
    const itemBlurb = scene.add.text(x, blurbY(bounds), getItemBlurb(item), config.styleDefaults, 0).setOrigin(0.5);
    return [itemImage, itemTitle, itemDescription, itemBlurb];
};

const getItemTitle = item => (item ? item.title : "Item Default Title");
const getItemDescription = item => (item ? item.description : "Item Default Description");
const getItemBlurb = item => (item ? item.longDescription : "");
const assetKey = (config, item) => (item ? `${config.assetPrefix}.${item.icon}` : "shop.itemIcon");
const imageY = bounds => -bounds.height / 4;
const promptY = outerBounds => -outerBounds.height * (3 / 8);
const currencyY = outerBounds => -outerBounds.height / 4;
const descriptionY = bounds => bounds.height / 8;
const blurbY = bounds => bounds.height / 3;
const getOffsetBounds = (outerBounds, innerBounds) => ({
    ...innerBounds,
    y: innerBounds.y + (outerBounds.height - innerBounds.height) * 0.38,
});
const imageX = (config, bounds) =>
    config.menu.buttonsRight ? bounds.x + bounds.width / 4 : bounds.x + (bounds.width / 4) * 3;
