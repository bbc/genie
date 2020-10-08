/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

/* eslint-disable no-console */
const handleIfVisible = (gelButton, scene) => {
    const outerContainer = gelButton.rexContainer.parent.getTopmostSizer();
    const mouseY = scene.input.y;
    const centreY = scene.scale.displaySize.height / 2;
    const halfInnerHeight = outerContainer.innerHeight / 2;
    const topY = centreY - halfInnerHeight;
    const bottomY = centreY + halfInnerHeight;
    if (mouseY >= topY && mouseY <= bottomY) console.log(`Clicked ${gelButton.config.id}`); // PH
};

const assetKey = (key, assetKeys) => [assetKeys.prefix, key].join(".");

export { handleIfVisible, assetKey };
