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
    return buy(transaction, shopCol, invCol);
};

const buy = (tx, shopCol, invCol) => {
    shopCol.set({ ...tx.item, state: "owned", qty: -1 });
    invCol.set({ ...tx.item, qty: +1 });
    return tx.item.price;
};
