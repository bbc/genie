/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { collections } from "../../core/collections.js";

export const setBalance = scene =>
    (scene.transientData[scene.scene.key] = {
        ...scene.transientData[scene.scene.key],
        balance: collections
            .get(scene.transientData.shop.config.shopCollections.manage)
            .get(scene.transientData.shop.config.balance).qty,
    });
