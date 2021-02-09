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

const getBalanceValue = scene =>
    collections.get(scene.config.paneCollections.manage).get(scene.config.balance.value.key).qty;

export const createBalance = scene => {
    const safeArea = getSafeArea(scene.layout);
    const metrics = getMetrics();
    const image = conf => scene.add.image(0, 0, `${scene.assetPrefix}.${conf.key}`);
    const text = conf => addText(scene, 0, 0, getBalanceValue(scene), conf);
    const container = scene.add.container();
    const configs = scene.config.balance;
    const padding = scene.config.balancePadding;

    const { background, icon, value } = Object.entries(configs).reduce(
        (elems, [key, config]) => ({ ...elems, [key]: makeElement({ image, text })(config) }),
        {},
    );

    const width = value.getBounds().width + icon.getBounds().width + padding * 3;
    value.setPosition(width / 4 - padding, 0);
    icon.setPosition(-width / 4, 0);
    background.setScale(width / background.getBounds().width);

    container.add([background, icon, value]);

    container.setScale(getScaleFactor({ metrics, container, safeArea }));
    container.setPosition(getXPos(container, safeArea, scene.config.listPadding.x), getYPos(metrics, safeArea));
    container.setText = bal => value.setText(bal);
    container.getValue = () => parseInt(value.text, 10);

    return container;
};
