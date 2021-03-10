/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { collections } from "../../core/collections.js";
import { gmi } from "../../core/gmi/gmi.js";
import { eventBus } from "../../core/event-bus.js";
import { playShopSound } from "./shop-sound.js";

const updateBalance = (scene, invCol, price) =>
    invCol.set({
        id: getBalanceItem(scene.transientData.shop.config).id,
        qty: getBalanceItem(scene.transientData.shop.config).qty - price,
    });

export const buy = (scene, item) => {
    const { shop, manage } = scene.transientData.shop.config.shopCollections;
    const invCol = collections.get(manage);
    const shopCol = collections.get(shop);
    const inventoryItem = invCol.get(item.id);
    const remainingStock = shopCol.get(item.id).qty - 1;
    shopCol.set({ id: item.id, qty: remainingStock });
    invCol.set({ id: item.id, state: "purchased", qty: inventoryItem ? inventoryItem.qty + 1 : 1 });
    gmi.sendStatsEvent("buy", "click", { metadata: `KEY=${item.id}~STATE=purchased~QTY=${remainingStock}`, source: item.title });
    updateBalance(scene, invCol, item.price);

    playShopSound(scene, item, "buy");
};

export const equip = (scene, item) => {
    const { manage } = scene.transientData.shop.config.shopCollections;
    const invCol = collections.get(manage);
    const itemsEquippedInSlot = invCol
        .getAll()
        .filter(invItem => invItem.slot === item.slot && invItem.state === "equipped");
    const maxItemsInSlot = scene.transientData.shop.config.slots[item.slot].max;
    itemsEquippedInSlot.length === maxItemsInSlot && unequip(scene, itemsEquippedInSlot[0]);
    gmi.sendStatsEvent("equip", "click", { metadata: `KEY=${item.id}~STATE=equipped~QTY=${item.qty}`, source: item.title });
    invCol.set({ id: item.id, state: "equipped" });
    playShopSound(scene, item, "equip");
};

export const unequip = (scene, item) => {
    const { manage } = scene.transientData.shop.config.shopCollections;
    const invCol = collections.get(manage);
    gmi.sendStatsEvent("unequip", "click", { metadata: `KEY=${item.id}~STATE=unequipped~QTY=${item.qty}`, source: item.title });
    invCol.set({ id: item.id, state: "purchased" });
    playShopSound(scene, item, "unequip");
};

export const use = (scene, item) => {
    const { manage } = scene.transientData.shop.config.shopCollections;
    const invCol = collections.get(manage);
    const invItem = invCol.get(item.id);
    const qtyLeft = invItem.qty - 1;
    gmi.sendStatsEvent("use", "click", { metadata: `KEY=${item.id}~STATE=used~QTY=${qtyLeft}`, source: item.title });
    eventBus.publish({
        channel: "shop",
        name: "used",
        data: invItem,
    });
    invCol.set({ id: item.id, qty: qtyLeft });
    playShopSound(scene, item, "use");
};

export const getBalanceItem = shopConfig => collections.get(shopConfig.shopCollections.manage).get(shopConfig.balance);
