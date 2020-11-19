/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import fp from "../../../lib/lodash/fp/fp.js";

export const doTransaction = transaction => fp.cond([
    [tx => tx.title === "shop", tx => buy(tx)],
    [tx => tx.title === "manage", tx => equip(tx)],
])(transaction);

// both of these need currying with inventory and shop collections.
const buy = () => console.log("buy");

const equip = () => console.log("equip");
