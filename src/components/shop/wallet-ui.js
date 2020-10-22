/**
 * Wallet UI component
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { getSafeArea, getXPos, getYPos, getScaleFactor } from "./shop-scaling.js";

const styleDefaults = {
    fontFamily: "ReithSans",
    fontSize: "24px",
    resolution: 4,
};

const makeElements = makerFns => conf => makerFns[conf.type](conf).setOrigin(0.5);

export const createWallet = (scene, metrics) => {
    const image = conf => scene.add.image(0, 0, `${scene.assetPrefix}.${conf.key}`);
    const text = conf => {
        const textStyle = { ...styleDefaults, ...conf.styles };
        return scene.add.text(0, 0, conf.value, textStyle);
    };

    const configs = scene.config.wallet || [];
    const padding = scene.config.walletPadding;
    const elems = configs.map(makeElements({ image, text }));

    const container = scene.add.container();

    const width = elems[2].getBounds().width + elems[1].getBounds().width + padding * 3;
    elems[2].setPosition(width / 4 - padding, 0);
    elems[1].setPosition(-width / 4, 0);
    elems[0].setScale(width / elems[0].getBounds().width);

    container.add(elems);

    const safeArea = getSafeArea(scene.layout);
    container.setScale(getScaleFactor({ metrics, container, safeArea }));
    container.setPosition(
        getXPos(container, safeArea, scene.config.listPadding.x),
        getYPos(metrics, safeArea),
    );

    return container;
};
