/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { canAffordItem, isEquippable, itemIsInStock } from "./item-checks.js";

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

export const promptText = {
    buy: args => getBuyPromptText(args.scene, args.action, args.item),
    equip: args => getEquipPromptText(args.scene, args.action, args.item),
    unequip: args => getUnequipPromptText(args.scene),
    use: args => getUsePromptText(args.scene),
};
