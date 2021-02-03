/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import {
    setVisible,
    resize,
    getInnerRectBounds,
    createRect,
    getSafeArea,
    createPaneBackground,
} from "./shop-layout.js";
import { addText } from "../../core/layout/text-elem.js";
import { createConfirmButtons } from "./menu-buttons.js";
import { doTransaction } from "./transact.js";
import { collections } from "../../core/collections.js";

export const createConfirm = scene => {
    const config = scene.config;
    const balance = scene.balance;
    const bounds = getSafeArea(scene.layout);

    const container = scene.add.container();
    container.config = config;
    container.memoisedBounds = bounds;

    const innerBounds = getOffsetBounds(bounds, getInnerRectBounds(scene));
    const yOffset = bounds.height / 2 + bounds.y;

    container.setY(yOffset);
    container.buttons = createConfirmButtons(container, handleClick(scene, container));

    const { prompt, price } = config.confirm;

    container.elems = {
        background: [createRect(scene, innerBounds, 0x0000ff), createPaneBackground(scene, bounds, "confirm")],
        prompt: addText(scene, getX(innerBounds.x, config), promptY(bounds), prompt.shop, prompt).setOrigin(0.5),
        price: addText(scene, getX(innerBounds.x + 28, config), currencyY(bounds), "PH", price).setOrigin(0.5),
        priceIcon: scene.add.image(
            getX(innerBounds.x - 28, config),
            currencyY(bounds),
            `${config.assetPrefix}.${config.assetKeys.currency}`,
        ),
        item: itemView(scene, undefined, config, bounds),
    };

    populate(container);

    container.setVisible = setVisible(container);
    container.resize = resize(container);
    container.update = update(container);
    container.prepTransaction = prepTransaction(scene, container);
    container.doTransaction = doTransaction(scene);
    container.setBalance = bal => balance.setText(bal);
    container.getBalance = () => balance.getValue();
    container.setLegal = setLegal(container);

    container.getElems = () => [
        container.elems.prompt,
        container.elems.price,
        container.elems.priceIcon,
        ...container.elems.item,
    ];
    return container;
};

const handleClick = (scene, container) => button => {
    if (button === "Confirm" && !container.transaction.isLegal) return;
    const cost = button === "Confirm" && confirm(container);
    cost && container.setBalance(container.getBalance() - cost);
    scene.back();
};

const isTransactionLegal = (container, item, title) => {
    const isShop = title === "shop";
    const itemState = getItemState(container, item, title);
    return isShop ? container.getBalance() >= parseInt(item.price) : itemState !== "equipped";
};

const confirm = container => container.transaction && container.doTransaction(container.transaction);

const update = container => (item, title) => {
    const isLegal = isTransactionLegal(container, item, title);
    container.elems.priceIcon.setVisible(title === "shop");
    container.elems.price.setText(title === "shop" ? item.price : "");
    updateItemView(container, item);
    container.transaction = { item, title, isLegal };
    container.setLegal(title, isLegal);
};

const updateItemView = (container, item) =>
    container.config.confirm.detailView ? updateItemDetailView(container, item) : updateItemImageView(container, item);

const updateItemDetailView = (container, item) => {
    const [itemImage, itemTitle, itemDetail, itemBlurb] = container.elems.item;

    setImageTextureAndScale(container, item, itemImage, getItemDetailImageScale);

    itemTitle.setText(getItemTitle(item));
    itemDetail.setText(getItemDetail(item));
    itemBlurb.setText(getItemBlurb(item));
};

const updateItemImageView = (container, item) => {
    const [image] = container.elems.item;
    setImageTextureAndScale(container, item, image, getItemImageScale);
};

const setImageTextureAndScale = (container, item, image, getScaleFn) => {
    image.setTexture(assetKey(item));
    const scale = getScaleFn(container.memoisedBounds, image);
    setImageScaleXY(image, scale, container.scaleX, container.scaleY);
};

const setLegal = container => (title, isLegal) => {
    const prompt = isLegal
        ? container.config.confirm.prompt[title].legal
        : container.config.confirm.prompt[title].illegal;
    container.elems.prompt.setText(prompt);
    container.buttons[0].setLegal(isLegal);
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
    scene.stack("confirm");
    container.update(item, title); // change name of method
};

const itemView = (scene, item, config, bounds) =>
    config.confirm.detailView
        ? itemDetailView(scene, item, config, bounds)
        : itemImageView(scene, item, config, bounds);

const itemImageView = (scene, item, config, bounds) => {
    const image = scene.add.image(imageX(config, bounds), 0, assetKey(item));
    const absScale = getItemImageScale(bounds, image);
    setImageScaleXY(image, absScale);
    return [image];
};

const itemDetailView = (scene, item, config, bounds) => {
    const x = imageX(config, bounds);
    const { title, detail, description } = config.confirm;

    const itemImage = scene.add.image(x, imageY(bounds), assetKey(item));
    setImageScaleXY(itemImage, getItemDetailImageScale(bounds, itemImage));

    const itemTitle = addText(scene, x, titleY(bounds), getItemTitle(item), title).setOrigin(0.5);
    const itemDetail = addText(scene, x, detailY(bounds), getItemDetail(item), detail).setOrigin(0.5);
    const itemBlurb = addText(scene, x, blurbY(bounds), getItemBlurb(item), description).setOrigin(0.5);

    return [itemImage, itemTitle, itemDetail, itemBlurb];
};

const setImageScaleXY = (image, absScale, containerScaleX = 1, containerScaleY = 1) => {
    image.setScale(absScale / containerScaleX, absScale / containerScaleY);
    image.memoisedScale = absScale;
};

const getItemState = (container, item, title) =>
    collections.get(getCollectionsKey(container, title)).get(item.id).state;
const getCollectionsKey = (container, title) => container.config.paneCollections[title];
const getItemTitle = item => (item ? item.title : "PH");
const getItemDetail = item => (item ? item.description : "PH");
const getItemBlurb = item => (item ? item.longDescription : "PH");
const getItemDetailImageScale = (bounds, image) => bounds.height / 3 / image.height;
const getItemImageScale = (bounds, image) => (bounds.width / 2 / image.width) * 0.9;
const assetKey = item => (item ? item.icon : "shop.itemIcon");
const getX = (x, config) => (config.menu.buttonsRight ? x : -x);

const imageY = bounds => -percentOfHeight(bounds, 25);
const promptY = outerBounds => -percentOfHeight(outerBounds, 37.5);
const currencyY = outerBounds => -percentOfHeight(outerBounds, 22.5);
const titleY = bounds => -percentOfHeight(bounds, 4);
const detailY = bounds => percentOfHeight(bounds, 5);
const blurbY = bounds => percentOfHeight(bounds, 25);
const percentOfHeight = (bounds, percent) => (bounds.height / 100) * percent;

const getOffsetBounds = (outerBounds, innerBounds) => ({
    ...innerBounds,
    y: innerBounds.y + (outerBounds.height - innerBounds.height) * 0.38,
});
const imageX = (config, bounds) =>
    config.menu.buttonsRight ? bounds.x + bounds.width / 4 : bounds.x + (bounds.width / 4) * 3;
