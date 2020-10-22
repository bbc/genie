/**
 * Wallet UI component
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { getSafeArea, getXPos, getYPos } from "./shop.js";

export const createWallet = (scene, metrics) => {
    const { wallet } = scene.config;

    const walletBackground = scene.add.image(0, 0, wallet.background);
    const walletIcon = scene.add.image(0, 0, wallet.icon);
    const walletBalance = scene.add.text(0, 0, wallet.defaultBalance, wallet.font).setOrigin(1, 0.5);
    const walletContainer = scene.add.container();

    const walletWidth = walletBalance.getBounds().width + walletIcon.getBounds().width + wallet.iconPadding * 3;
    walletBalance.setPosition(walletWidth / 4 + wallet.iconPadding, 0);
    walletIcon.setPosition(-walletWidth / 4, 0);
    walletBackground.setScale(walletWidth / walletBackground.getBounds().width);
    walletContainer.add([walletBackground, walletIcon, walletBalance]);

    const safeArea = getSafeArea(scene.layout);
    walletContainer.setScale(scene.getScaleFactor(metrics, walletContainer));
    walletContainer.setPosition(
        getXPos(walletContainer, safeArea, scene.config.listPadding.x),
        getYPos(metrics, getSafeArea(scene.layout)),
    );

    return walletContainer;
};
