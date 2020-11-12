/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createTitles } from "../select/titles.js";
import { getYPos, getScaleFactor } from "./shop-layout.js";

export const createTitle = (scene, metrics, safeArea) => {
    const titleContainer = scene.add.container();
    titleContainer.add(createTitles(scene));

    titleContainer.setScale(
        getScaleFactor({
            metrics,
            container: titleContainer,
            fixedWidth: true,
            safeArea,
        }),
    );
    titleContainer.setPosition(0, getYPos(metrics, safeArea));
    titleContainer.setTitleText = setTitleText(titleContainer);

    return titleContainer;
};

const setTitleText = titleContainer => text => {
    const titleTextSprite = titleContainer.list.find(item => item.type === "Text");
    titleTextSprite.setText(text.charAt(0).toUpperCase() + text.slice(1).toLowerCase());
};
