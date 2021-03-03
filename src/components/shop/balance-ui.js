/**
 * Balance UI component
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { getXPos, getYPos, getScaleFactor, getSafeArea } from "./shop-layout.js";
import { addText } from "../../core/layout/text-elem.js";
import { getMetrics } from "../../core/scaler.js";
import { collections } from "../../core/collections.js";

const makeElement = makerFns => conf => makerFns[conf.type](conf).setOrigin(0.5);

const getBalanceValue = shopConfig =>
    collections.get(shopConfig.shopCollections.manage).get(shopConfig.balance.value.key).qty;

export const createBalance = scene => {
    const safeArea = getSafeArea(scene.layout);
    const metrics = getMetrics();
    const image = conf => scene.add.image(0, 0, conf.key);
    const shopConfig = scene.transientData.shop.config;
    const text = conf => addText(scene, 0, 0, getBalanceValue(shopConfig), conf);
    const container = scene.add.container();

    const { background, icon, value } = Object.entries(shopConfig.balance).reduce(
        (elems, [key, config]) => ({ ...elems, [key]: makeElement({ image, text })(config) }),
        {},
    );

    const width = value.getBounds().width + icon.getBounds().width + shopConfig.balancePadding * 3;
    value.setPosition(width / 4 - shopConfig.balancePadding, 0);
    icon.setPosition(-width / 4, 0);
    background.setScale(width / background.getBounds().width);

    container.add([background, icon, value]);

    container.setScale(getScaleFactor({ metrics, container, safeArea }));
    container.setPosition(getXPos(container, safeArea), getYPos(metrics, safeArea));

    const resize = () => {
        const newSafeArea = getSafeArea(scene.layout);
        container.setScale(getScaleFactor({ metrics, container, safeArea: newSafeArea }));
        container.setPosition(getXPos(container, newSafeArea), getYPos(metrics, newSafeArea));
    };

    const update = () => value.setText(getBalanceValue(shopConfig));

    return {
        container,
        resize,
        update,
    };
};
