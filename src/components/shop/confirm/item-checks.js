/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getBalanceItem } from "../transact.js";
import { collections } from "../../../core/collections.js";

export const getShopConfig = scene => scene.transientData.shop.config;
export const canAffordItem = (scene, item) => item && getBalanceItem(getShopConfig(scene)).qty >= item.price;
export const itemIsInStock = (scene, item) =>
    item && collections.get(getShopConfig(scene).shopCollections.shop).get(item.id).qty > 0;

export const isEquippable = item => Boolean(item.slot);
