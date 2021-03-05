/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMenuButtons, resizeGelButtons } from "./menu-buttons.js";
import { getInnerRectBounds, getSafeArea } from "./shop-layout.js";

export const createMenu = scene => {
    const container = scene.add.container();
    const bounds = getSafeArea(scene.layout);
    const innerBounds = getInnerRectBounds(scene);

    const contents = [
        scene.add.rectangle(innerBounds.x, innerBounds.y, innerBounds.width, innerBounds.height, 0x000000, 0),
    ];
    container.add(contents);
    container.setY(bounds.height / 2 + bounds.y);

    const buttons = createMenuButtons(scene);
    resizeGelButtons({ buttons, container });

    return {
        resize: () => resizeGelButtons({ buttons, container }),
    };
};
