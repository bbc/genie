/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createItemPanel, resizeItemPanel } from "./item-panel.js";
import { createButtonPanel, resizeButtonPanel } from "./button-panel.js";
import { actions } from "./actions.js";
import fp from "../../../../lib/lodash/fp/fp.js";

export const createConfirm = scene => {
    const title = scene.transientData.shop.mode;
    const item = scene.transientData.shop.item;

    const action = actions[title](scene, item);
    scene.transientData[scene.scene.key] = { action };

    const buttonPanel = createButtonPanel(scene, item);
    const itemPanel = createItemPanel(scene, item);

    return fp.flow(resizeItemPanel(scene, itemPanel), resizeButtonPanel(scene, buttonPanel));
};
