/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { collections } from "../../../core/collections.js";
import fp from "../../../../lib/lodash/fp/fp.js";

const getInventoryAction = (scene, item) => {

    const inventory = collections.get(scene.transientData.shop.config.shopCollections.manage);
    const inventoryItem = inventory.get(item?.id);
    return getActionName(inventoryItem);
};
const getActionName = fp.cond([
    [i => Boolean(!i.slot), () => "use"],
    [i => i.state === "equipped", () => "unequip"],
    [i => i.state === "purchased", () => "equip"],
]);

export const actions = {
    shop: () => "buy",
    manage: (scene, item) => getInventoryAction(scene, item),
};
