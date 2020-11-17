/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { setVisible, resize } from "./shop-layout.js";

export const createConfirm = (scene, config, bounds) => {

    const confirmContainer = scene.add.container();
    confirmContainer.add(scene.add.text(0, 0, "someText"));

    confirmContainer.buttons = [];
    confirmContainer.setVisible = setVisible(confirmContainer);
    confirmContainer.resize = resize(confirmContainer);
    

    return confirmContainer;
};

// this is probably what we want to provide to gel buttons as a callback
// sets visibility on confirm screen
// provides a fn to perform the tx
export const confirmTransaction = () => console.log("confirm tx"); 