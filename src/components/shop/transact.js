/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { collections } from "../../core/collections.js";
import { gmi } from "../../core/gmi/gmi.js";

export const buy = (scene, item) => {
    const { shop, manage } = scene.config.paneCollections;
    const invCol = collections.get(manage);
    const shopCol = collections.get(shop);
    const inventoryItem = invCol.get(item.id);
    shopCol.set({ ...item, qty: shopCol.get(item.id).qty - 1 });
    invCol.set({ ...item, state: "purchased", qty: inventoryItem ? inventoryItem.qty + 1 : 1 });
    updateBalance(scene, invCol, item.price);
};

export const equip = (scene, item) => {
    const { manage } = scene.config.paneCollections;
    const invCol = collections.get(manage);
    const itemsEquippedInSlot = invCol
        .getAll()
        .filter(invItem => invItem.slot === item.slot && invItem.state === "equipped");
    const maxItemsInSlot = scene.config.slots[item.slot].max;
    itemsEquippedInSlot.length === maxItemsInSlot && unequip(scene, itemsEquippedInSlot[0]);
    invCol.set({ ...item, state: "equipped" });
};

export const unequip = (scene, item) => {
    const { manage } = scene.config.paneCollections;
    const invCol = collections.get(manage);
    invCol.set({ ...item, state: "purchased" });
};

export const use = (scene, item) => {
    const { manage } = scene.config.paneCollections;
    const invCol = collections.get(manage);
    const invItem = invCol.get(item.id);
    invCol.set({ ...invItem, qty: invItem.qty - 1 });
};

const updateBalance = (scene, invCol, price) =>
    invCol.set({ ...getBalanceItem(scene), qty: getBalanceItem(scene).qty - price }) ||
    scene.events.emit("updatebalance");

export const getBalanceItem = scene =>
    collections.get(scene.config.paneCollections.manage).get(scene.config.balance.value.key);
