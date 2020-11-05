/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createTitles } from "../select/titles.js";
import { getSafeArea, getYPos, getScaleFactor } from "./shop-layout.js";

export const createTitle = (scene, metrics, safeArea) => {
    const titleContainer = scene.add.container();
    titleContainer.add(createTitles(scene));

    // const safeArea = getSafeArea(scene.layout);

    titleContainer.setScale(
        getScaleFactor({
            metrics,
            container: titleContainer,
            fixedWidth: true,
            safeArea,
        }),
    );
    titleContainer.setPosition(0, getYPos(metrics, safeArea));

    return titleContainer;
};
