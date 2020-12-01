/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createTitles } from "../select/titles.js";
import { getYPos, getScaleFactor, getSafeArea } from "./shop-layout.js";
import { getMetrics } from "../../core/scaler.js";

export const createTitle = scene => {
    const safeArea = getSafeArea(scene.layout);
    const metrics = getMetrics();
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
