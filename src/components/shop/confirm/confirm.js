/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../../lib/lodash/fp/fp.js";
import { addText } from "../../../core/layout/text.js";
import { collections } from "../../../core/collections.js";
import { createBackground } from "../backgrounds.js";
import { itemView } from "./item-view.js";
import { addConfirmButtons } from "./confirm-buttons.js";
import { itemIsInStock, getShopConfig } from "./item-checks.js";
import { promptText } from "./prompt-text.js";
import { resizeFn } from "./confirm-resize.js";

const createElems = (scene, container, promptText, item) => ({
    background: createBackground(scene, scene.config.confirm?.background),
    prompt: addText(scene, 0, 0, promptText, scene.config).setOrigin(0.5),
    itemView: itemView(scene, item, scene.config),
});

const createBuyElems = (scene, container, item) => ({
    text: addText(scene, 0, 0, item.price, scene.config).setOrigin(0.5),
    currency: scene.add.image(0, 0, `${scene.assetPrefix}.currencyIcon`),
});

const getAction = (scene, title, item) => (title === "shop" ? "buy" : getInventoryAction(scene, item));

const getInventoryAction = (scene, item) => {
    const inventoryItem = collections.get(getShopConfig(scene).shopCollections.manage).get(item?.id);
    return getActionName(inventoryItem);
};

const getActionName = fp.cond([
    [i => Boolean(!i.slot), () => "use"],
    [i => i.state === "equipped", () => "unequip"],
    [i => i.state === "purchased", () => "equip"],
]);

export const createConfirm = (scene, title, item) => {
    const action = getAction(scene, title, item);
    const container = scene.add.container();
    const elems = createElems(scene, container, promptText[action]({ scene, action, item }), item);
    const buyElems = action === "buy" && itemIsInStock(scene, item) && createBuyElems(scene, container, item);
    const buttons = addConfirmButtons(scene, title, action, item);

    const { itemView, ...otherElems } = elems;
    Object.values({ ...otherElems, ...itemView }).forEach(elem => container.add(elem));
    Object.values(buyElems).forEach(elem => container.add(elem));

    const resize = resizeFn(scene, container, buyElems, buttons, elems);

    return {
        action,
        resize,
    };
};
