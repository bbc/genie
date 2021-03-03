/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { getInnerRectBounds, getSafeArea, createPaneBackground } from "./shop-layout.js";
import { addText } from "../../core/layout/text-elem.js";
import { createConfirmButtons } from "./menu-buttons.js";
import { CAMERA_X, CAMERA_Y } from "../../core/layout/metrics.js";
import { buy, equip, unequip, use, getBalanceItem } from "./transact.js";
import { collections } from "../../core/collections.js";

export const createConfirm = (scene, title, item) => {
    const action = getAction(scene, title, item);
    const bounds = getSafeArea(scene.layout);
    const container = scene.add.container();
    const innerBounds = getOffsetBounds(bounds, getInnerRectBounds(scene));
    const yOffset = bounds.height / 2 + bounds.y;
    container.setY(yOffset);
    createElems(scene, container, getPromptText({ scene, action, item }), item, innerBounds, bounds);
    action === "buy" && itemIsInStock(scene, item) && createBuyElems(scene, container, item, innerBounds, bounds);

    return {
        action,
        item,
        title,
        container,
        buttons: addConfirmButtons(scene, container, innerBounds, title, action, item),
    };
};

const createElems = (scene, container, promptText, item, innerBounds, bounds) =>
    container.add(
        [
            addText(
                scene,
                getButtonX(innerBounds.x, scene.config),
                promptY(bounds),
                promptText,
                scene.config,
            ).setOrigin(0.5),
            createPaneBackground(scene, bounds, "confirm"),
        ].concat(itemView(scene, item, scene.config, bounds)),
    );

const createBuyElems = (scene, container, item, innerBounds, bounds) =>
    container.add([
        addText(
            scene,
            getButtonX(innerBounds.x + 28, scene.config),
            currencyY(bounds),
            item.price,
            scene.config,
        ).setOrigin(0.5),
        scene.add.image(
            getButtonX(innerBounds.x - 20, scene.config),
            currencyY(bounds),
            `${scene.assetPrefix}.currencyIcon`,
        ),
    ]);

const sizeConfirmButton = (scene, button, idx, bounds) => {
    button.setY(CAMERA_Y + (idx * bounds.height) / 2);
    button.setX(CAMERA_X + getButtonX(bounds.x, scene.config));
    button.setScale(bounds.width / button.width);
};

const sizeConfirmButtons = (scene, confirmButtons, bounds) =>
    confirmButtons.forEach((button, idx) => sizeConfirmButton(scene, button, idx, bounds));

const disableActionButton = button => {
    Object.assign(button, { alpha: 0.25, tint: 0xff0000 });
    button.input.enabled = false;
    button.accessibleElement.update();
};

const addConfirmButtons = (scene, container, innerBounds, title, action, item) => {
    const confirmButtonCallback = () => handleActionClick(scene, container, title, action, item);
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
    container.add(confirmButtons);
    ((action === "buy" && !canBuyItem(scene, item)) || (action === "equip" && !isEquippable(item))) &&
        disableActionButton(confirmButtons[0]);
    sizeConfirmButtons(scene, confirmButtons, innerBounds);
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

const handleActionClick = (scene, container, title, action, item) => {
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

const itemView = (scene, item, config, bounds) =>
    config.confirm.detailView
        ? itemDetailView(scene, item, config, bounds)
        : itemImageView(scene, item, config, bounds);

const itemImageView = (scene, item, config, bounds) => {
    const image = scene.add.image(imageX(config, bounds), 0, item.icon);
    const absScale = getItemImageScale(bounds, image);
    setImageScaleXY(image, absScale);
    return [image];
};

const itemDetailView = (scene, item, config, bounds) => {
    const x = imageX(config, bounds);
    const { title, detail, description } = config.confirm;

    const itemImage = scene.add.image(x, imageY(bounds), item.icon);
    setImageScaleXY(itemImage, getItemDetailImageScale(bounds, itemImage));

    const itemTitle = addText(scene, x, titleY(bounds), item.title, title).setOrigin(0.5);
    const itemDetail = addText(scene, x, detailY(bounds), item.description, detail).setOrigin(0.5);
    const itemBlurb = addText(scene, x, blurbY(bounds), item.longDescription, description).setOrigin(0.5);

    return [itemImage, itemTitle, itemDetail, itemBlurb];
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
