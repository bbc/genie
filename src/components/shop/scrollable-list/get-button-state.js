/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { collections } from "../../../core/collections.js";

const equippable = item => Boolean(item.slot);
const qtyOneOrMore = item => item?.qty > 0;
const locked = (item, config) => item.state && config.states[item.state] && config.states[item.state].disabled;
const equipped = item => item?.state === "equipped";

export const getButtonState = (scene, item, title) => {
    const states = [];
    const inventoryItem = collections.get(scene.transientData.shop.config.shopCollections.manage).get(item.id);
    const isButtonCta = title === "shop" ? qtyOneOrMore(inventoryItem) : equipped(inventoryItem);

    states.push(isButtonCta ? "actioned" : "cta");
    states.push(equippable(item) ? "equippable" : "consumable");
    states.push(qtyOneOrMore(item) ? "available" : "unavailable");
    states.push(locked(item, scene.config) ? "locked" : "unlocked");
    return states;
};
