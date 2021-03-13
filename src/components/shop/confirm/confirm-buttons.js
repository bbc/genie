/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createConfirmButtons } from "../menu-buttons.js";
import fp from "../../../../lib/lodash/fp/fp.js";
import { buy, equip, unequip, use } from "../transact.js";
import { canAffordItem, isEquippable, itemIsInStock } from "./utility-rename.js";

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

export const addConfirmButtons = (scene, title, action, item) => {
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
