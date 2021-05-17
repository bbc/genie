/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createConfirmButtons, resizeGelButtons } from "../menu-buttons.js";
import fp from "../../../../lib/lodash/fp/fp.js";
import { buy, equip, unequip, use } from "../transact.js";
import { canAffordItem, isEquippable, itemIsInStock } from "./item-checks.js";
import { getInnerRectBounds, getSafeArea } from "../shop-layout.js";

const disableActionButton = button => {
    Object.assign(button, { alpha: 0.25, tint: 0xff0000 });
    button.input.enabled = false;
    button.accessibleElement.update();
};

const handleActionClick = (scene, title, action, item) => {
    actions[action]({ scene, item });
    scene._data.addedBy.scene.resume();
    scene.removeOverlay();
};

const actions = {
    buy: args => buy(args.scene, args.item),
    equip: args => equip(args.scene, args.item),
    unequip: args => unequip(args.scene, args.item),
    use: args => use(args.scene, args.item),
};

const canBuyItem = (scene, item) => canAffordItem(scene, item) && itemIsInStock(scene, item);

const getRect = scene => {
    const bounds = getSafeArea(scene.layout);
    const innerBounds = getInnerRectBounds(scene);
    const rect = scene.add.rectangle(innerBounds.x, innerBounds.y, innerBounds.width, innerBounds.height, 0x000000, 0);

    rect.setSize(innerBounds.width, innerBounds.height);
    rect.setY(bounds.height / 2 + bounds.y);

    return rect;
};

export const addConfirmButtons = (scene, title, action, item) => {
    const rect = getRect(scene);
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
        item,
    );
    resizeGelButtons({ confirmButtons, rect });
    ((action === "buy" && !canBuyItem(scene, item)) || (action === "equip" && !isEquippable(item))) &&
        disableActionButton(confirmButtons[0]);
    return confirmButtons;
};
