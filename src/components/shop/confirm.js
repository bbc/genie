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
    textStyle,
} from "./shop-layout.js";
import { createConfirmButtons } from "./menu-buttons.js";
import { doTransaction } from "./transact.js";
import { collections } from "../../core/collections.js";

export const createConfirm = scene => {
    const config = scene.config;
    const balance = scene.balance;
    const bounds = getSafeArea(scene.layout);

    const { styleDefaults } = config;

    const container = scene.add.container();
    container.config = config;
    container.memoisedBounds = bounds;

    const innerBounds = getOffsetBounds(bounds, getInnerRectBounds(scene));
    const yOffset = bounds.height / 2 + bounds.y;

    container.setY(yOffset);
    container.buttons = createConfirmButtons(container, handleClick(scene, container));

    container.elems = {
        background: [createRect(scene, innerBounds, 0x0000ff), createPaneBackground(scene, bounds, "confirm")],
        prompt: scene.add
            .text(
                getX(innerBounds.x, config),
                promptY(bounds),
                config.confirm.prompt.shop,
                textStyle(styleDefaults, config.confirm.prompt),
            )
            .setOrigin(0.5),
        price: scene.add
            .text(
                getX(innerBounds.x + 28, config),
                currencyY(bounds),
                "PH",
                textStyle(styleDefaults, config.confirm.price),
            )
            .setOrigin(0.5),
        priceIcon: scene.add.image(
            getX(innerBounds.x - 20, config),
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
    // container.resize(getSafeArea(container.scene.layout)); // trying taking this out, as top menu buttons weren't right.
};

const updateItemView = (container, item) =>
    container.config.confirm.detailView ? updateItemDetailView(container, item) : updateItemImageView(container, item);

const updateItemDetailView = (container, item) => {
    const [itemImage, itemTitle, itemDetail, itemBlurb] = container.elems.item;
    itemImage.setTexture(assetKey(item));

    const imageScale = getItemDetailImageScale(container.memoisedBounds, itemImage);
    setImageScaleXY(itemImage, imageScale, container.scaleX, container.scaleY);

    itemTitle.setText(getItemTitle(item));
    itemDetail.setText(getItemDetail(item));
    itemBlurb.setText(getItemBlurb(item));
};

const updateItemImageView = (container, item) => {
    const [image] = container.elems.item;
    image.setTexture(assetKey(item));
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
    container.update(item, title);
};

const itemView = (scene, item, config, bounds) =>
    config.confirm.detailView
        ? itemDetailView(scene, item, config, bounds)
        : itemImageView(scene, item, config, bounds);

const itemImageView = (scene, item, config, bounds) => {
    const image = scene.add.image(imageX(config, bounds), 0, assetKey(item));
    const absScale = (bounds.width / 2 / image.width) * 0.9;
    setImageScaleXY(image, absScale);
    return [image];
};

const itemDetailView = (scene, item, config, bounds) => {
    const x = imageX(config, bounds);
    const { styleDefaults } = config;
    const { title, detail, description } = config.confirm;

    const itemImage = scene.add.image(x, imageY(bounds), assetKey(item));
    setImageScaleXY(itemImage, getItemDetailImageScale(bounds, itemImage));

    const itemTitle = scene.add.text(x, 0, getItemTitle(item), textStyle(styleDefaults, title)).setOrigin(0.5);
    const itemDetail = scene.add
        .text(x, detailY(bounds), getItemDetail(item), textStyle(styleDefaults, detail))
        .setOrigin(0.5);
    const itemBlurb = scene.add
        .text(x, blurbY(bounds), getItemBlurb(item), textStyle(styleDefaults, description), 0)
        .setOrigin(0.5);
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
const assetKey = item => (item ? item.icon : "shop.itemIcon");
const imageY = bounds => -bounds.height / 4;
const getX = (x, config) => (config.menu.buttonsRight ? x : -x);
const promptY = outerBounds => -outerBounds.height * (3 / 8);
const currencyY = outerBounds => -outerBounds.height / 4;
const detailY = bounds => bounds.height / 12;
const blurbY = bounds => bounds.height / 4;
const getOffsetBounds = (outerBounds, innerBounds) => ({
    ...innerBounds,
    y: innerBounds.y + (outerBounds.height - innerBounds.height) * 0.38,
});
const imageX = (config, bounds) =>
    config.menu.buttonsRight ? bounds.x + bounds.width / 4 : bounds.x + (bounds.width / 4) * 3;
