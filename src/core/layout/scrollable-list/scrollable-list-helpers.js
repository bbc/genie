/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

/* eslint-disable no-console */
export const onClick = gelButton => {
    console.log(`Clicked ${gelButton.config.id}`); // placeholder
};

export const assetKey = (key, assetKeys) => {
    return [assetKeys.prefix, key].join(".");
};
