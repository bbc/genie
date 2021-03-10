/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { getInnerRectBounds, getSafeArea } from "./shop-layout.js";
import { addText } from "../../core/layout/text-elem.js";
import { createConfirmButtons } from "./menu-buttons.js";
import { CAMERA_X, CAMERA_Y } from "../../core/layout/metrics.js";
import { buy, equip, unequip, use, getBalanceItem } from "./transact.js";
import { collections } from "../../core/collections.js";
import { createBackground, resizeBackground } from "./backgrounds.js";

const getShopConfig = scene => scene.transientData.shop.config;
const canBuyItem = (scene, item) => canAffordItem(scene, item) && itemIsInStock(scene, item);
const canAffordItem = (scene, item) => item && getBalanceItem(getShopConfig(scene)).qty >= item.price;
const isEquippable = item => item && item.slot;
const itemIsInStock = (scene, item) =>
    item && collections.get(getShopConfig(scene).shopCollections.shop).get(item.id).qty > 0;
const getItemDetailImageScale = (bounds, image) => bounds.height / 3 / image.height;
const getItemImageScale = (bounds, image) => (bounds.width / 2 / image.width) * 0.9;
const getButtonX = (x, config) => (config.confirm.buttons.buttonsRight ? x : -x);
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
    config.confirm.buttons.buttonsRight ? bounds.x + bounds.width / 4 : bounds.x + (bounds.width / 4) * 3;

const createElems = (scene, container, promptText, item, bounds) => {
    const bgConfig = scene.config.confirm?.background;

    const elems = [
        createBackground(scene, bgConfig),
        addText(scene, 0, 0, promptText, scene.config).setOrigin(0.5),
    ].concat(itemView(scene, item, scene.config, bounds));

    container.add(elems);

    return elems;
};

const createBuyElems = (scene, container, item) =>
    container.add([
        addText(scene, 0, 0, item.price, scene.config).setOrigin(0.5),
        scene.add.image(0, 0, `${scene.assetPrefix}.currencyIcon`),
    ]);

const sizeConfirmButton = (scene, button, idx, bounds, innerBounds) => {
    button.setY(CAMERA_Y + (idx * innerBounds.height) / 2 + bounds.height / 2 + bounds.y);
    button.setX(CAMERA_X + getButtonX(innerBounds.x, scene.config));
    button.setScale(innerBounds.width / button.width);
};

const sizeConfirmButtons = (scene, confirmButtons, bounds, innerBounds) =>
    confirmButtons.forEach((button, idx) => sizeConfirmButton(scene, button, idx, bounds, innerBounds));

const disableActionButton = button => {
    Object.assign(button, { alpha: 0.25, tint: 0xff0000 });
    button.input.enabled = false;
    button.accessibleElement.update();
};

const addConfirmButtons = (scene, title, action, item) => {
    const confirmButtonCallback = () => handleActionClick(scene, title, action, item);
    const cancelButtonCallback = () => {
        scene._data.addedBy.scene.resume();
        scene.removeOverlay();
    };
    const confirmButtons = createConfirmButtons(
        scene,
        fp.startCase(action),
        confirmButtonCallback,
        cancelButtonCallback,
    );
    ((action === "buy" && !canBuyItem(scene, item)) || (action === "equip" && !isEquippable(item))) &&
        disableActionButton(confirmButtons[0]);
    return confirmButtons;
};

const getAction = (scene, title, item) => {
    return title === "shop" ? "buy" : getInventoryAction(scene, item);
};

const getInventoryAction = (scene, item) => {
    const inventoryItem = collections.get(getShopConfig(scene).shopCollections.manage).get(item?.id);
    return inferAction(inventoryItem);
};

const inferAction = fp.cond([
    [i => Boolean(!i.slot), () => "use"],
    [i => i.state === "equipped", () => "unequip"],
    [i => i.state === "purchased", () => "equip"],
]);

const handleActionClick = (scene, title, action, item) => {
    doAction({ scene, action, item });
    scene._data.addedBy.scene.resume();
    scene.removeOverlay();
};

const doAction = fp.cond([
    [args => args.action === "buy", args => buy(args.scene, args.item)],
    [args => args.action === "equip", args => equip(args.scene, args.item)],
    [args => args.action === "unequip", args => unequip(args.scene, args.item)],
    [args => args.action === "use", args => use(args.scene, args.item)],
]);

const itemView = (scene, item, config) =>
    config.confirm.detailView ? itemDetailView(scene, item, config) : itemImageView(scene, item);

const itemImageView = (scene, item) => {
    const image = scene.add.image(0, 0, item.icon);
    return [image];
};

const scaleItemImageView = (image, config, bounds) => {
    image.setPosition(imageX(config, bounds));
    const absScale = getItemImageScale(bounds, image);
    setImageScaleXY(image, absScale);
};

const itemDetailView = (scene, item, config) => {
    const { title, detail, description } = config.confirm;

    const itemImage = scene.add.image(0, 0, item.icon);

    const itemTitle = addText(scene, 0, 0, item.title, title).setOrigin(0.5);
    const itemDetail = addText(scene, 0, 0, item.description, detail).setOrigin(0.5);
    const itemBlurb = addText(scene, 0, 0, item.longDescription, description).setOrigin(0.5);

    return [itemImage, itemTitle, itemDetail, itemBlurb];
};

const scaleItemDetailView = (objects, config, bounds) => {
    setImageScaleXY(objects[0], getItemDetailImageScale(bounds, objects[0]));
    const x = imageX(config, bounds);
    objects[0].setPosition(x, imageY(bounds));
    objects[1].setPosition(x, titleY(bounds));
    objects[2].setPosition(x, detailY(bounds));
    objects[3].setPosition(x, blurbY(bounds));
};

const setImageScaleXY = (image, absScale, containerScaleX = 1, containerScaleY = 1) => {
    image.setScale(absScale / containerScaleX, absScale / containerScaleY);
    image.memoisedScale = absScale;
};

const getEquipPromptText = (scene, action, item) =>
    isEquippable(item) ? scene.config.confirm.prompt[action].legal : scene.config.confirm.prompt[action].illegal;

const getUnequipPromptText = scene => scene.config.confirm.prompt.unequip;

const getUsePromptText = scene => scene.config.confirm.prompt.use;

const getBuyPromptText = (scene, action, item) =>
    canAffordItem(scene, item)
        ? itemIsInStock(scene, item)
            ? scene.config.confirm.prompt[action].legal
            : scene.config.confirm.prompt[action].unavailable
        : scene.config.confirm.prompt[action].illegal;

const getPromptText = fp.cond([
    [args => args.action === "buy", args => getBuyPromptText(args.scene, args.action, args.item)],
    [args => args.action === "equip", args => getEquipPromptText(args.scene, args.action, args.item)],
    [args => args.action === "unequip", args => getUnequipPromptText(args.scene)],
    [args => args.action === "use", args => getUsePromptText(args.scene)],
]);

export const createConfirm = (scene, title, item) => {
    const action = getAction(scene, title, item);
    const bounds = getSafeArea(scene.layout);
    const container = scene.add.container();
    const elems = createElems(scene, container, getPromptText({ scene, action, item }), item, bounds);
    const buyElems = action === "buy" && itemIsInStock(scene, item) && createBuyElems(scene, container, item);
    const buttons = addConfirmButtons(scene, title, action, item);

    const resize = () => {
        const bounds = getSafeArea(scene.layout);
        const innerBounds = getOffsetBounds(bounds, getInnerRectBounds(scene));
        const yOffset = bounds.height / 2 + bounds.y;
        const xOffset = scene.config.confirm.buttons.buttonsRight ? -0.25 : 0.25;
        const bgSpec = { yOffset, aspect: 0.5, xOffset };
        container.setY(yOffset);
        resizeBackground(elems[0].constructor)(scene, elems[0], bgSpec);
        elems[1].setPosition(getButtonX(innerBounds.x, scene.config), promptY(bounds));
        buyElems.list[6].setPosition(getButtonX(innerBounds.x + 28, scene.config), currencyY(bounds));
        buyElems.list[7].setPosition(getButtonX(innerBounds.x - 20, scene.config), currencyY(bounds));
        sizeConfirmButtons(scene, buttons, bounds, innerBounds);
        scaleItemDetailView(fp.takeRight(4, elems), scene.config, bounds);
    };

    return {
        action,
        item,
        title,
        container,
        resize,
        buttons,
    };
};
