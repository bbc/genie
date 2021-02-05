/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { collections } from "../../core/collections.js";
import { updateBalanceText } from "./balance-ui.js";

export const buy = (scene, item) => {
    const { shop, manage } = scene.config.paneCollections;
    const invCol = collections.get(manage);
    const shopCol = collections.get(shop);
    const inventoryItem = invCol.get(item.id);
    shopCol.set({ ...item, qty: shopCol.get(item.id).qty - 1 });
    invCol.set({ ...item, state: "owned", qty: inventoryItem ? inventoryItem.qty + 1 : 1 });
    updateBalance(scene, invCol, scene.config.balance.value.key, item.price);
};

const equip = (tx, invCol) => {
    invCol.set({ ...tx.item, state: "equipped" });
};

const updateBalance = (scene, invCol, currencyKey, price) => {
    const currency = invCol.get(currencyKey);
    const newBalance = currency.qty - price;
    invCol.set({ ...currency, qty: newBalance });
    updateBalanceText(scene);
};
