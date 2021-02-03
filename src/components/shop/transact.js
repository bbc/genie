/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { collections } from "../../core/collections.js";

export const doTransaction = scene => tx => {
    const { shop, manage } = scene.config.paneCollections;
    const invCol = collections.get(manage);
    return (
        (tx.title === "shop" && buy(tx, shop, invCol, scene.config.balance.value.key)) ||
        (tx.title === "manage" && equip(tx, invCol))
    );
};

const buy = (tx, shop, invCol, currencyKey) => {
    const shopCol = collections.get(shop);
    shopCol.set({ ...tx.item, state: "owned", qty: -1 }); // fix
    invCol.set({ ...tx.item, qty: +1 });
    updateBalance(invCol, currencyKey, tx.item.price);
    return tx.item.price;
};

const equip = (tx, invCol) => {
    invCol.set({ ...tx.item, state: "equipped" });
};

const updateBalance = (invCol, currencyKey, price) => {
    const currency = invCol.get(currencyKey);
    const newBalance = currency.qty - price;
    invCol.set({ ...currency, qty: newBalance });
};
