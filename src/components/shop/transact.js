/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { collections } from "../../core/collections.js";

export const doTransaction = scene => transaction => {
    const { shop, manage } = scene.config.paneCollections;
    const shopCol = collections.get(shop);
    const invCol = collections.get(manage);
    buy(transaction, shopCol, invCol);
};

const buy = (tx, shopCol, invCol) => {
    shopCol.set({ id: tx.item.id, state: "owned", qty: -1 });
    invCol.set({ id: tx.item.id, qty: +1 });
};
