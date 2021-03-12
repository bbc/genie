/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../../lib/lodash/fp/fp.js";
import { getInnerRectBounds, getSafeArea } from "../shop-layout.js";
import { addText } from "../../../core/layout/text.js";
import { CAMERA_X, CAMERA_Y } from "../../../core/layout/metrics.js";
import { buy, equip, unequip, use, getBalanceItem } from "../transact.js";
import { collections } from "../../../core/collections.js";
import { createBackground, resizeBackground } from "../backgrounds.js";
import { itemView, scaleItemView } from "./item-view.js";
import { addConfirmButtons } from "./confirm-buttons.js";

const getShopConfig = scene => scene.transientData.shop.config;
const canAffordItem = (scene, item) => item && getBalanceItem(getShopConfig(scene)).qty >= item.price;
const isEquippable = item => item && item.slot;
const itemIsInStock = (scene, item) =>
    item && collections.get(getShopConfig(scene).shopCollections.shop).get(item.id).qty > 0;


const getButtonX = (x, config) => (config.confirm.buttons.buttonsRight ? x : -x);

const promptY = outerBounds => -percentOfHeight(outerBounds, 37.5);
const currencyY = outerBounds => -percentOfHeight(outerBounds, 22.5);

const percentOfHeight = (bounds, percent) => (bounds.height / 100) * percent;
const getOffsetBounds = (outerBounds, innerBounds) => ({
    ...innerBounds,
    y: innerBounds.y + (outerBounds.height - innerBounds.height) * 0.38,
});

const createElems = (scene, container, promptText, item) => ({
    background: createBackground(scene, scene.config.confirm?.background),
    prompt: addText(scene, 0, 0, promptText, scene.config).setOrigin(0.5),
    itemView: itemView(scene, item, scene.config),
});

const scalePrompt = (scene, elems, bounds, innerBounds) =>
    elems.prompt.setPosition(getButtonX(innerBounds.x, scene.config), promptY(bounds));

const createBuyElems = (scene, container, item) => ({
    text: addText(scene, 0, 0, item.price, scene.config).setOrigin(0.5),
    currency: scene.add.image(0, 0, `${scene.assetPrefix}.currencyIcon`),
});

const scaleBuyElems = (scene, buyElems, bounds, innerBounds) => {
    buyElems.text.setPosition(getButtonX(innerBounds.x + 28, scene.config), currencyY(bounds));
    buyElems.currency.setPosition(getButtonX(innerBounds.x - 20, scene.config), currencyY(bounds));
};

const sizeConfirmButton = (scene, button, idx, bounds, innerBounds) => {
    button.setY(CAMERA_Y + (idx * innerBounds.height) / 2 + bounds.height / 2 + bounds.y);
    button.setX(CAMERA_X + getButtonX(innerBounds.x, scene.config));
    button.setScale(innerBounds.width / button.width);
};

const sizeConfirmButtons = (scene, confirmButtons, bounds, innerBounds) =>
    confirmButtons.forEach((button, idx) => sizeConfirmButton(scene, button, idx, bounds, innerBounds));

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
    const container = scene.add.container();
    const elems = createElems(scene, container, getPromptText({ scene, action, item }), item);
    const buyElems = action === "buy" && itemIsInStock(scene, item) && createBuyElems(scene, container, item);
    const buttons = addConfirmButtons(scene, title, action, item);

    const { itemView, ...otherElems } = elems;
    Object.values({ ...otherElems, ...itemView }).forEach(elem => container.add(elem));
    Object.values(buyElems).forEach(elem => container.add(elem));

    const resize = () => {
        const bounds = getSafeArea(scene.layout);
        const innerBounds = getOffsetBounds(bounds, getInnerRectBounds(scene));
        const yOffset = bounds.height / 2 + bounds.y;
        const xOffset = scene.config.confirm.buttons.buttonsRight ? -0.25 : 0.25;
        const bgSpec = { yOffset, aspect: 0.5, xOffset };
        container.setY(yOffset);
        resizeBackground(elems.background.constructor)(scene, elems.background, bgSpec);
        scalePrompt(scene, elems, bounds, innerBounds);
        buyElems && scaleBuyElems(scene, buyElems, bounds, innerBounds);
        sizeConfirmButtons(scene, buttons, bounds, innerBounds);
        scaleItemView(elems.itemView, scene.config, bounds);
    };

    return {
        action,
        resize,
    };
};
