/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { getInnerRectBounds, createRect, getSafeArea, createPaneBackground, textStyle } from "./shop-layout.js";
import { createConfirmButtons } from "./menu-buttons.js";
import { collections } from "../../core/collections.js";
import { CAMERA_X, CAMERA_Y } from "../../core/layout/metrics.js";

const createElems = (scene, container, promptText, item, innerBounds, bounds) =>
    container.add(
        [
            scene.add
                .text(
                    getX(innerBounds.x, scene.config),
                    promptY(bounds),
                    promptText,
                    textStyle(scene.config.styleDefaults, scene.config.confirm.prompt),
                )
                .setOrigin(0.5),
            createRect(scene, innerBounds, 0x0000ff),
            createPaneBackground(scene, bounds, "confirm"),
        ].concat(itemView(scene, item, scene.config, bounds)),
    );

const createBuyElems = (scene, container, item, innerBounds, bounds) =>
    container.add([
        scene.add
            .text(
                getX(innerBounds.x + 28, scene.config),
                currencyY(bounds),
                item.price,
                textStyle(scene.config.styleDefaults, scene.config.confirm.price),
            )
            .setOrigin(0.5),
        scene.add.image(
            getX(innerBounds.x - 20, scene.config),
            currencyY(bounds),
            `${scene.config.assetPrefix}.${scene.config.assetKeys.currency}`,
        ),
    ]);

const resizeConfirmButton = (button, idx, bounds) => {
    button.setY(CAMERA_Y + (idx * bounds.height) / 2);
    button.setX(CAMERA_X + bounds.x);
    button.setScale(bounds.width / button.width);
};

const resizeConfirmButtons = (confirmButtons, bounds) =>
    confirmButtons.forEach((button, idx) => resizeConfirmButton(button, idx, bounds));

const addConfirmButtons = (scene, container, innerBounds, action) => {
    const confirmButtonCallback = () => handleClick(scene, container, action);
    const confirmButtons = createConfirmButtons(container, [fp.startCase(action), "Cancel"], confirmButtonCallback);
    container.add(confirmButtons);
    resizeConfirmButtons(confirmButtons, innerBounds);
};

export const createConfirm = (scene, action, item) => {
    const bounds = getSafeArea(scene.layout);
    const container = scene.add.container();
    const innerBounds = getOffsetBounds(bounds, getInnerRectBounds(scene));
    const yOffset = bounds.height / 2 + bounds.y;
    container.setY(yOffset);
    createElems(scene, container, getPromptText(scene, action, item), item, innerBounds, bounds);
    action === "buy" && createBuyElems(scene, container, item, innerBounds, bounds);
    addConfirmButtons(scene, container, innerBounds, action);
    return container;
};

const destroyContainer = container => {
    container.removeAll(true);
    container.destroy();
};

const handleClick = (scene, container, action) => {
    // const cost = button === "Confirm" && confirm(container);
    // cost && container.setBalance(container.getBalance() - cost);
    destroyContainer(container);
    scene.panes.shop.setVisible(true);
    scene.paneStack.pop();
    const paneToShow = scene.paneStack.slice(-1)[0];
    scene.title.setTitleText(paneToShow ? paneToShow : "Shop");
};

const confirm = container => container.transaction && container.doTransaction(container.transaction);

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
const getItemImageScale = (bounds, image) => (bounds.width / 2 / image.width) * 0.9;
const assetKey = item => (item ? item.icon : "shop.itemIcon");
const imageY = bounds => -bounds.height / 4;
const getX = (x, config) => (config.menu.buttonsRight ? x : -x);
const getPromptText = (scene, action, item) =>
    action === "buy"
        ? scene.balance.getValue() >= item.price
            ? scene.config.confirm.prompt[action].legal
            : scene.config.confirm.prompt[action].illegal
        : scene.config.confirm.prompt[action];
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
